import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WpImage from "@/components/wpImage";

const Nav = ({ menu }: { menu: any }) => {
    menu.forEach((item: any) => {
        item.menu_item_parent = parseInt(item.menu_item_parent, 10);
    });
    // Create a hierarchy based on the parent-child relationship
    const createHierarchy = (items: any, parentId = 0) =>
        items
            .filter((item: any) => item.menu_item_parent === parentId)
            .map((item: any) => ({
                ...item,
                children: createHierarchy(items, item.ID),
            }));

// ...

    const hierarchy = createHierarchy(menu);

    console.log('Filtered Menu: ', JSON.stringify(menu));

    // Render a menu item and its children
    const renderMenuItem = (item: any) => (
        <li key={item.ID}>
            <Link
                href={item.url}
                className={`relative block leading-loose text-bright-sun-400 pr-2 hover:text-black hover:bg-bright-sun-400 hover:pl-4 transition-all`}
            >
                {item.menu_item_parent > 0 && (
                    <svg viewBox="0 0 492 726" height={16} className={`absolute top-0 -left-4 bottom-0 my-2 scale-75 fill-white/10`}>
                        <path d="M173 552h318v173H0V0h173v552Z"/>
                    </svg>
                )}
                {item.title}
            </Link>
            {item.children.length > 0 && <ul className={`flex flex-col pl-4 list-none`}>{item.children.map((child: any) => renderMenuItem(child))}</ul>}
        </li>
    );

    // Render the top-level menu items
    const renderMenuItems = hierarchy.filter((item: any) => item.menu_item_parent === 0);

    return (
        <>
            <ul
                className={`flex flex-col mb-6 list-none`}
            >
                {renderMenuItems.map((item: any) => renderMenuItem(item))}
            </ul>
        </>
    );
};

function Header({menu, options, latestPosts}: {menu: any, options: any, latestPosts: any}) {
    const [headerState, setHeader] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const toggleHeader = () => {
        setHeader(headerState === false ? true : false);
    }

    useEffect(() => {
        const content = document.querySelector('#content');
        if (content) {
            if (headerState) {
                content.classList.add('max-h-0');
                content.classList.add('lg:max-h-max');
                content.classList.add('overflow-hidden');
                content.classList.add('lg:overflow-auto');
            } else {
                content.classList.remove('max-h-0');
                content.classList.remove('lg:max-h-max');
                content.classList.remove('overflow-hidden');
                content.classList.remove('lg:overflow-auto');
            }
        }
    }, [headerState]);

    const handleSearch = () => {
        // Replace spaces with '+' in the search query
        const formattedQuery = searchQuery.split(' ').join('+');
        // Use the router to push the new URL without reloading the [slug]
        router.push(`/search/${formattedQuery}`);
    };

    return (
        <header className={`lg:sticky lg:top-0 w-full lg:w-1/3 xl:w-1/4 2xl:w-1/5 ${headerState ? 'closed' : 'open'} overflow-hidden font-sans bg-black/80 h-auto max-h-max lg:h-screen backdrop-blur-md backdrop-saturate-200`}>
            <button onClick={toggleHeader} className={`flex flex-row ${headerState ? 'text-white/50' : 'text-bright-sun-400'} max-w-max pt-7 pb-3 my-0 mx-auto`}>
                <svg viewBox="0 0 24 24" width={16} height={16} className={`inline-flex fill-current my-1`}>
                    <path d={headerState ? `M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z` : `M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z`} />
                </svg>
                <span className={`inline-flex pl-1 uppercase`}>
                    <span className={headerState ? `pr-1 max-w-full transition-[width,padding] overflow-hidden` : `max-w-0 transition-[width,padding] overflow-hidden`}>Hide</span>
                    Menu
                </span>
            </button>
            <div className={`inner w-full lg:w-[200%] flex flex-col lg:grid lg:grid-cols-2 ${headerState ? 'max-h-fit lg:translate-x-0' : 'max-h-0 lg:max-h-fit lg:-translate-x-1/2'} transition-all`}>
                <div className={`menu-section h-auto min-h-full lg:h-[calc(100vh-4em)] px-6 xl:order-1 overflow-y-auto transition-all xl:transition-none scrollbar-thin scrollbar-track-black scrollbar-thumb-white/25`}>
                    <h3
                        className={`uppercase text-md text-white/50 mt-8 mb-4`}
                    >
                        Navigation
                    </h3>
                    <Nav menu={menu}/>
                    <h3
                        className={`uppercase text-md text-white/50 my-4`}
                    >
                        Latest
                    </h3>
                    {latestPosts && (
                        <ul className={`flex flex-col gap-2 list-none`}>
                            {latestPosts.map((post: any) => (
                                <li
                                    key={post.id}
                                >
                                    <Link className={`text-bright-sun-400 hover:text-bright-sun-500 transition-colors`} href={`/${post.slug}`} dangerouslySetInnerHTML={{ __html: post.title.rendered }}></Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Prevent the default form submission behavior
                            // Call the search handler with the new query
                            handleSearch();
                        }}
                        action={`/search/${searchQuery}`} // Optional: You can set the action attribute to the desired URL if needed
                        className={`flex flex-row my-6 rounded-md overflow-hidden`}
                    >
                        <input
                            type={`search`}
                            name={`s`}
                            placeholder={`Search`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`py-2 px-4 w-full rounded-none placeholder:uppercase`}
                        />
                        <button
                            type={`submit`}
                            className={`py-2 px-6 bg-bright-sun-400`}
                        >
                            <svg viewBox="0 0 24 24" width={24} height={24} className={`fill-bright-sun-700`}><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
                        </button>
                    </form>
                </div>
                <div className={`home-section h-auto xl:h-[calc(100vh-4em)] -order-1 xl:order-2 overflow-y-auto`}>
                    {options && (
                        <>
                            <Link
                                href={`/`}
                                title={options.name}
                                className={`block max-w-max mx-auto`}
                            >
                                <WpImage url={options.site_logo_url} src={{
                                    '': [
                                        {
                                            width: 128,
                                            height: 128
                                        }
                                    ]
                                }} className={`rounded-full`} alt={options.name} focalPoint={[50,50]} props={``} />
                            </Link>
                            <Link
                                href={`/`}
                                className={`block max-w-max py-1 px-1.5 mt-6 mx-auto mb-2 rounded text-xl font-bold leading-tight text-bright-sun-400 hover:text-black hover:bg-bright-sun-400 transition-colors text-center`}
                            >
                                {options.name}
                            </Link>
                            <p
                                className={`max-w-max mt-0 mx-auto mb-6 text-lg text-white/50`}
                            >
                                {options.description}
                            </p>
                            <hr
                                className={`w-1/2 mt-0 mx-auto mb-6 h-1.5 bg-white/10 border-none rounded-sm`}
                            />
                            <p
                                className={`max-w-max mt-0 mx-auto mb-4 text-lg text-white/50`}
                            >
                                Connect
                            </p>
                            <ul
                                className={`flex flex-row gap-1.5 max-w-max p-0 my-0 mb-6 mx-auto text-white/50 hover:[&_a]:text-white list-none`}
                            >
                                <li><a target={`_blank`} className={`transition-colors`} href={options.site_connect.mastodon}>
                                    <svg viewBox="0 0 24 24" width={32} height={32} className={`fill-current`}><path d="M20.94,14C20.66,15.41 18.5,16.96 15.97,17.26C14.66,17.41 13.37,17.56 12,17.5C9.75,17.39 8,16.96 8,16.96V17.58C8.32,19.8 10.22,19.93 12.03,20C13.85,20.05 15.47,19.54 15.47,19.54L15.55,21.19C15.55,21.19 14.27,21.87 12,22C10.75,22.07 9.19,21.97 7.38,21.5C3.46,20.45 2.78,16.26 2.68,12L2.67,8.57C2.67,4.23 5.5,2.96 5.5,2.96C6.95,2.3 9.41,2 11.97,2H12.03C14.59,2 17.05,2.3 18.5,2.96C18.5,2.96 21.33,4.23 21.33,8.57C21.33,8.57 21.37,11.78 20.94,14M18,8.91C18,7.83 17.7,7 17.15,6.35C16.59,5.72 15.85,5.39 14.92,5.39C13.86,5.39 13.05,5.8 12.5,6.62L12,7.5L11.5,6.62C10.94,5.8 10.14,5.39 9.07,5.39C8.15,5.39 7.41,5.72 6.84,6.35C6.29,7 6,7.83 6,8.91V14.17H8.1V9.06C8.1,8 8.55,7.44 9.46,7.44C10.46,7.44 10.96,8.09 10.96,9.37V12.16H13.03V9.37C13.03,8.09 13.53,7.44 14.54,7.44C15.44,7.44 15.89,8 15.89,9.06V14.17H18V8.91Z" /></svg>
                                </a></li>
                                <li><a target={`_blank`} className={`transition-colors`} href={options.site_connect.instagram}>
                                    <svg viewBox="0 0 24 24" width={32} height={32} className={`fill-current`}><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" /></svg>
                                </a></li>
                                <li><a target={`_blank`} className={`transition-colors`} href={options.site_connect.youtube}>
                                    <svg viewBox="0 0 24 24" width={32} height={32} className={`fill-current`}><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" /></svg>
                                </a></li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;