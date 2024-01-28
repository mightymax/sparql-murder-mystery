<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
  type MenuItem = { route: string, label: string; title?: string }
	const menuItems:MenuItem[] = [
    {route: '/', label: 'Home' },
    {route: '/walkthrough', label: 'Walkthrough' },
    {route: '/advanced', label: 'Advanced' },
    {route: '/about', label: 'About' },
  ];

  const currentItem = menuItems.filter(menuItem => $page.url.pathname == menuItem.route).pop()
  $: pageTitle =
		currentItem !== undefined ? currentItem.title : 'Pagina not found'

	onMount(() => {
		const header = document.querySelector('header');
		window.onscroll = () => {
			if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
				header?.classList.add('small');
			} else {
				header?.classList.remove('small');
			}
		};
	});

</script>

<svelte:head>
	<title>SPARQL Murder Mystery</title>
	<meta property="og:title" content="SPARQL Murder Mystery | {pageTitle}" />
</svelte:head>
<header>
	<nav class="navbar navbar-expand-lg fixed-top">
		<div class="container">
			<a class="navbar-brand" href="/">
				<img src="/images/detective-header.svg" alt="SPARQL Murder Mystery Scene" />
			</a>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<div class="navbar-nav"> 
					{#each menuItems as menuItem}
						<a
							class="nav-link"
              class:active={$page.url.pathname === menuItem.route || (menuItem.route !== '/' && $page.url.pathname.startsWith(menuItem.route))}
							href={menuItem.route}
						>
							{menuItem.label}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</nav>
</header>
<style>
nav {
  background-image: url('/images/header-background.svg');
	background-repeat: no-repeat;
	background-size: auto 100%;
	background-position: 0 0;
  border-bottom-color: green;
  border-bottom-width: 20px;
	box-shadow:
		0 4px 8px 0 rgba(76, 33, 110, 0.1),
		0 6px 20px 0 rgba(76, 33, 110, 0.09);
}

.nav-link {
  margin-right: 10px;
  font-weight: 500;
  color: #fff;
  border-top: var(--yellow) solid 2px !important;
  border-bottom: var(--yellow) solid 2px;
  margin-right: 10px;
}

.nav-link.active,
.nav-link:hover {
  border-top: var(--yellow-shadow) solid 2px;
  border-bottom: var(--yellow-shadow) solid 2px;
}

img {
  transition: 0.4s;
}


.navbar-brand img {
  height: 200px;
}

header.small .navbar-brand img{
	height: 75px;
}
</style>
