import fs from 'node:fs';
import sqlite3 from 'sqlite3';
import n3 from 'n3';
import path from 'node:path';
// const DB_LOC = 'https://raw.githubusercontent.com/NUKnightLab/sql-mysteries/master/sql-murder-mystery.db';
// Not sure if we need named graphs, so paramatrise it:
const USE_GRAPHS = false;
const quad = (s, p, o, g) => n3.DataFactory.quad(s, p, o, USE_GRAPHS ? g : undefined);
const identifiers = new Map();
const namedNode = n3.DataFactory.namedNode;
const literal = n3.DataFactory.literal;
const skolemIri = (prefix, id) => namedNode(`${prefix}:${id ?? ID(prefix)}`);
const ID = (classname) => {
    if (!identifiers.has(classname))
        identifiers.set(classname, 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    else
        identifiers.set(classname, identifiers.get(classname) + 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (identifiers.get(classname)).toString(16).padStart(4, '0');
};
const club = namedNode('get-fit-now');
const date = (date) => literal(`${date.toString().substring(0, 4)}-${date.toString().substring(4, 6)}-${date.toString().substring(6, 8)}`, xsd('date'));
const dateTime = (date, time) => {
    let t = '';
    if (time < 1000)
        t = '00:00:00';
    else {
        let HH = parseInt(time.toString().substring(0, 2));
        let MM = parseInt(time.toString().substring(2, 4));
        if (HH >= 24)
            HH = 0;
        if (MM >= 60)
            MM = 0;
        if (HH < 10)
            HH = `0${HH}`;
        if (MM < 10)
            MM = `0${MM}`;
        t = `${HH}:${MM}:00`;
    }
    return literal(`${date.toString().substring(0, 4)}-${date.toString().substring(4, 6)}-${date.toString().substring(6, 8)}T${t}`, xsd('dateTime'));
};
const mystery = (suffix) => namedNode(`mystery:${suffix}`);
const sdo = (suffix) => namedNode(`https://schema.org/${suffix}`);
const xsd = (suffix) => namedNode(`http://www.w3.org/2001/XMLSchema#${suffix}`);
const rdf = (suffix) => namedNode(`http://www.w3.org/1999/02/22-rdf-syntax-ns#${suffix}`);
const rdfs = (suffix) => namedNode(`http://www.w3.org/2000/01/rdf-schema#${suffix}`);
const a = rdf('type');
const extract = {
    person: ($row, writer) => {
        const row = $row;
        const id = namedNode(`person:${row.id}`);
        const graph = namedNode('graph:person');
        writer.addQuads([
            quad(id, a, sdo('Person'), graph),
            quad(id, sdo('name'), literal(row.name), graph),
            quad(id, mystery('houseNumber'), literal(row.address_number, xsd('integer')), graph),
            quad(id, mystery('streetName'), literal(row.address_street_name), graph),
            quad(id, mystery('driversLicense'), namedNode(`permit:${row.license_id}`), graph),
            quad(id, sdo('streetAddress'), literal(`${row.address_number} ${row.address_street_name}`), graph),
            // quad(id, sdo('taxID'), literal(row.ssn, xsd('int')), graph)
            quad(id, mystery('income'), namedNode(`income:${row.ssn}`), graph)
        ]);
    },
    income: ($row, writer) => {
        const row = $row;
        const bn = namedNode(`income:${row.ssn}`);
        const graph = namedNode('graph:income');
        writer.addQuads([
            quad(bn, a, sdo('MonetaryAmount'), graph),
            quad(bn, sdo('value'), literal(row.annual_income), graph),
            quad(bn, sdo('additionalType'), literal('Annual Income'), graph),
            quad(bn, sdo('taxID'), literal(row.ssn), graph)
        ]);
    },
    facebook_event_checkin: ($row, writer) => {
        const row = $row;
        const event = namedNode(`event:${row.event_id}`);
        const checkin = skolemIri('action');
        const graph = namedNode('graph:facebook-event-checkin');
        writer.addQuads([
            quad(checkin, a, sdo('JoinAction'), graph),
            quad(checkin, sdo('agent'), namedNode(`person:${row.person_id}`), graph),
            quad(checkin, sdo('startDate'), date(row.date), graph),
            quad(checkin, sdo('object'), event, graph),
            quad(event, a, sdo('Event'), graph),
            quad(event, sdo('attendee'), namedNode(`person:${row.person_id}`), graph),
            quad(event, sdo('name'), literal(row.event_name.trim()), graph)
        ]);
    },
    drivers_license: ($row, writer) => {
        const row = $row;
        const graph = namedNode('graph:permit');
        const id = namedNode(`permit:${row.id}`);
        const person = skolemIri('driver');
        const car = skolemIri('car');
        // const height = blanknode('permit:driver:height', row.id)
        const gender = sdo(row.gender.substring(0, 1).toUpperCase() + row.gender.substring(1));
        writer.addQuads([
            quad(id, a, sdo('Permit'), graph),
            quad(id, sdo('additionalType'), namedNode('https://www.wikidata.org/wiki/Q205647'), graph),
            quad(id, mystery('driver'), person, graph),
            quad(id, mystery('car'), car, graph),
            quad(person, a, sdo('Person'), graph),
            quad(person, sdo('gender'), gender, graph),
            quad(person, sdo('height'), literal(row.height, xsd('integer')), graph),
            quad(person, mystery('age'), literal(row.age, xsd('integer')), graph),
            quad(person, mystery('eyeColor'), literal(row.eye_color), graph),
            quad(person, mystery('hairColor'), literal(row.hair_color), graph),
            quad(car, a, sdo('Car'), graph),
            quad(id, sdo('identifier'), literal(row.plate_number), graph),
            quad(car, sdo('manufacturer'), literal(row.car_make), graph),
            quad(car, sdo('model'), literal(row.car_model), graph)
        ]);
    },
    interview: ($row, writer) => {
        const row = $row;
        const graph = namedNode('graph:interview');
        const bn = skolemIri('interview');
        writer.addQuads([
            quad(bn, a, sdo('Report'), graph),
            quad(bn, sdo('text'), literal(row.transcript.trim()), graph),
            quad(bn, sdo('additionalType'), literal('interview'), graph),
            quad(bn, mystery('person'), namedNode(`person:${row.person_id}`), graph)
        ]);
    },
    get_fit_now_member: ($row, writer) => {
        const row = $row;
        const id = namedNode(`membership:${row.id}`);
        const action = skolemIri('action');
        const graph = namedNode('graph:get-fit-now-member');
        writer.addQuads([
            quad(id, a, sdo('ProgramMembership'), graph),
            quad(id, sdo('hostingOrganization'), club, graph),
            quad(id, sdo('membershipNumber'), literal(row.id), graph),
            quad(id, sdo('additionalType'), literal(row.membership_status), graph),
            quad(id, sdo('member'), namedNode(`person:${row.person_id}`), graph),
            quad(action, a, sdo('RegisterAction'), graph),
            quad(action, sdo('startDate'), date(row.membership_start_date), graph),
            quad(action, sdo('agent'), namedNode(`person:${row.person_id}`), graph),
            quad(action, sdo('object'), id, graph)
        ]);
    },
    get_fit_now_check_in: ($row, writer) => {
        const row = $row;
        const graph = namedNode('graph:get-fit-check-in');
        const checkInAction = skolemIri('action');
        const checkOutAction = skolemIri('action');
        writer.addQuads([
            quad(checkInAction, a, sdo('CheckInAction'), graph),
            quad(checkInAction, sdo('agent'), namedNode(`membership:${row.membership_id}`), graph),
            quad(checkInAction, sdo('startTime'), dateTime(row.check_in_date, row.check_in_time), graph),
            quad(checkInAction, sdo('object'), club, graph),
            quad(checkOutAction, a, sdo('CheckOutAction'), graph),
            quad(checkOutAction, sdo('agent'), namedNode(`membership:${row.membership_id}`), graph),
            quad(checkOutAction, sdo('startTime'), dateTime(row.check_in_date, row.check_out_time), graph),
            quad(checkOutAction, sdo('object'), club, graph)
        ]);
    },
    generic: (_$row, writer) => {
        const graph = namedNode('graph:default');
        writer.addQuads([
            quad(club, a, sdo('ExerciseGym'), graph),
            quad(mystery('DriversLicense'), rdfs('subClassOf'), sdo('Thing'), graph),
            quad(mystery('DriversLicense'), rdfs('label'), literal('Drivers License'), graph),
            quad(mystery('PersonProperty'), rdfs('subClassOf'), sdo('Property'), graph),
            quad(mystery('PersonProperty'), rdfs('domain'), sdo('Person'), graph),
            quad(mystery('PersonProperty'), rdfs('label'), literal('Property describing a person\'s appearance on a Drivers License'), graph),
            quad(mystery('age'), a, mystery('PersonProperty'), graph),
            quad(mystery('age'), rdfs('range'), xsd('integer'), graph),
            quad(mystery('age'), rdfs('label'), literal('Age of a person in years'), graph),
            quad(mystery('hairColor'), a, mystery('PersonProperty'), graph),
            quad(mystery('hairColor'), rdfs('label'), literal('Hair color of a person'), graph),
            quad(mystery('eyeColor'), a, mystery('PersonProperty'), graph),
            quad(mystery('eyeColor'), rdfs('label'), literal('Eye color of a person'), graph),
            quad(mystery('driver'), a, sdo('Property'), graph),
            quad(mystery('driver'), rdfs('label'), literal('The driver registred on the licence'), graph),
            quad(mystery('driver'), rdfs('range'), sdo('Person'), graph),
            quad(mystery('driver'), rdfs('domain'), mystery('DriversLicense'), graph),
            quad(mystery('car'), a, sdo('Property'), graph),
            quad(mystery('car'), rdfs('label'), literal('The car registred on the licence'), graph),
            quad(mystery('car'), rdfs('range'), sdo('Car'), graph),
            quad(mystery('car'), rdfs('domain'), mystery('DriversLicense'), graph),
            quad(club, sdo('name'), literal('Get Fit Now!'), graph)
        ]);
    },
    crime_scene_report: ($row, writer) => {
        const row = $row;
        const bn = skolemIri('report');
        const graph = namedNode('graph:report');
        writer.addQuads([
            quad(bn, a, sdo('Report'), graph),
            quad(bn, sdo('text'), literal(row.description.trim()), graph),
            quad(bn, sdo('dateCreated'), date(row.date), graph),
            quad(bn, sdo('additionalType'), literal(row.type), graph),
            quad(bn, sdo('spatialCoverage'), literal(row.city), graph),
            quad(bn, sdo('description'), literal('Crime Scene Report'), graph)
        ]);
    }
};
const getWriter = (dest, tablename) => {
    const ttl = fs.createWriteStream(path.join(dest, `${tablename}.${USE_GRAPHS ? 'trig' : 'ttl'}`));
    return new n3.Writer(ttl, {
        prefixes: {
            sdo: sdo(''),
            def: mystery(''),
            xsd: xsd(''),
            rdf: rdf(''),
            rdfs: rdfs('')
        },
        end: false
    });
};
function main(dbFile, dest) {
    const extractors = Object.keys(extract);
    // ontology and defs:
    const writer = getWriter(dest, 'generic');
    extract.generic({}, writer);
    writer.end();
    const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY);
    db.each('SELECT name FROM sqlite_master where type = "table"', function (e, $row) {
        if (e !== null)
            console.error(e);
        const table = $row;
        if (extractors.includes(table.name)) {
            const writer = getWriter(dest, table.name);
            db.each(`select * from ${table.name}`, (_err, row) => {
                const $row = row;
                for (const key of Object.keys(row)) {
                    if (typeof $row[key] === 'string')
                        $row[key] = $row[key].replaceAll(/SQL/g, 'SPARQL');
                }
                extract[table.name]($row, writer);
            }, (_err, rowCount) => {
                console.log(`processed ${rowCount} rows from table ${table.name}`);
                writer.end();
            });
        }
        else
            console.log(`No extractor for table '${table.name}'`);
    });
}
if (!fs.existsSync('./data/mystery/rdf')) fs.mkdirSync('./data/mystery/rdf', {recursive: true})
const dbPath = './data/sql-murder-mystery.db';
main(dbPath, './data/mystery/rdf');
// const db = fs.createWriteStream(dbPath);
// https.get(DB_LOC, (res) => {
//     res.pipe(db);
//     db.on('finish', () => {
//         db.close();
//         console.log('sql-murder-mystery.db succesfully downloaded');
//         main(dbPath, './data/rdf');
//     });
// }).on('error', (err) => {
//     throw err;
// });
