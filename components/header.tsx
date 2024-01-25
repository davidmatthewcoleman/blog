import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import parse from "html-react-parser";
import WpImage from '@/components/wpImage';

function Header({menu, options, latestPosts}: {menu: any, options: any, latestPosts: any}) {
    const [headerState, setHeader] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const toggleHeader = () => {
        setHeader(!headerState);
    }

    const closeHeader = () => {
        setHeader(false);
    }

    useEffect(() => {
        const content = document.getElementById('content');
        if (content) {
            if (headerState) {
                content.classList.add('h-0');
                content.classList.add('lg:h-max');
                content.classList.add('overflow-hidden');
                content.classList.add('lg:overflow-auto');
            } else {
                content.classList.remove('h-0');
                content.classList.remove('lg:h-max');
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

    // Render a menu item and its children
    const renderMenuItem = (item: any) => (
        <li key={item.ID}>
            <Link
                href={item.url.replace(process.env.WORDPRESS_HOST, process.env.FRONTEND_HOST)}
                target={item.target ? item.target : '_self'}
                className={`relative block leading-loose text-bright-sun-400 pr-2 hover:text-black hover:bg-bright-sun-400 hover:pl-4 transition-all`}
                onClick={closeHeader}
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
        <header className={`lg:sticky lg:top-0 w-full lg:w-1/3 xl:w-1/4 2xl:w-1/5 ${headerState ? 'closed' : 'open'} overflow-hidden font-sans h-auto max-h-max lg:h-screen`}>
            <div className={`w-full ${headerState ? 'h-[calc(100%_-_2.5rem)]' : 'h-full'} bg-black/80 backdrop-blur-md backdrop-saturate-200 transition-all`}>
                <button onClick={toggleHeader}
                        className={`flex flex-row ${headerState ? 'text-white/50' : 'text-bright-sun-400'} max-w-max pt-7 px-4 pb-3 my-0 mx-auto`}>
                    <svg viewBox="0 0 24 24" width={16} height={16} className={`inline-flex fill-current my-1`}>
                        <path
                            d={headerState ? `M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z` : `M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z`}/>
                    </svg>
                    <span className={`inline-flex pl-1 uppercase`}>
                    <span
                        className={headerState ? `pr-1 max-w-full transition-[width,padding] overflow-hidden` : `max-w-0 transition-[width,padding] overflow-hidden`}>Hide</span>
                    Menu
                </span>
                </button>
                <div
                    className={`inner w-full lg:w-[200%] flex flex-col lg:grid lg:grid-cols-2 ${headerState ? 'max-h-fit lg:translate-x-0' : 'max-h-0 lg:max-h-fit lg:-translate-x-1/2'} transition-all`}>
                    <div
                        className={`menu-section h-auto min-h-full lg:h-[calc(100vh-4em)] px-6${headerState && ' lg:pb-8'} lg:order-1 overflow-y-auto transition-all xl:transition-none scrollbar-thin scrollbar-track-black scrollbar-thumb-white/25`}>
                        <h3
                            className={`uppercase text-md text-white/50 mt-8 mb-4`}
                        >
                            Navigation
                        </h3>
                        <ul
                            className={`flex flex-col mb-6 list-none`}
                        >
                            {renderMenuItems.map((item: any) => renderMenuItem(item))}
                        </ul>
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
                                        <Link
                                            className={`text-bright-sun-400 hover:text-bright-sun-500 transition-colors`}
                                            href={`/${post.slug}`} onClick={closeHeader}
                                            dangerouslySetInnerHTML={{__html: post.title.rendered}}></Link>
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
                                <svg viewBox="0 0 24 24" width={24} height={24} className={`fill-bright-sun-700`}>
                                    <path
                                        d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                    <div className={`home-section h-auto xl:h-[calc(100vh-4em)] -order-1 lg:order-2 overflow-y-auto`}>
                        {options && (
                            <>
                                <Link
                                    href={`/`}
                                    title={options.name}
                                    className={`block max-w-max mx-auto`}
                                    onClick={closeHeader}
                                >
                                    <WpImage url={options.site_logo_url} src={{
                                        '': [
                                            {
                                                width: 128,
                                                height: 128
                                            }
                                        ]
                                    }} className={`rounded-full`} alt={options.name} focalPoint={[50, 50]} props={``}/>
                                </Link>
                                <Link
                                    href={`/`}
                                    onClick={closeHeader}
                                    className={`block max-w-max py-1 px-1.5 mt-6 mx-auto mb-2 rounded text-xl font-bold leading-tight text-bright-sun-400 hover:text-black hover:bg-bright-sun-400 transition-colors text-center`}
                                >
                                    <span className={`hidden lg:block`}>{options.name}</span>
                                    <span className={`lg:hidden block`}>{options.shortname}</span>
                                </Link>
                                <p
                                    className={`max-w-max mt-0 mx-auto mb-6 text-lg text-white/50`}
                                >
                                    {options.description}
                                </p>
                                <hr
                                    className={`w-1/2 mt-0 mx-auto mb-6 h-1.5 bg-white/10 border-none rounded-sm`}
                                />
                                {options.site_connect && (
                                    <>
                                        <p
                                            className={`max-w-max mt-0 mx-auto mb-4 text-lg text-white/50`}
                                        >
                                            Connect
                                        </p>
                                        <ul
                                            className={`flex flex-row gap-1.5 max-w-max p-0 my-0 mb-6 mx-auto text-white/50 hover:[&_a]:text-white list-none`}
                                        >
                                            {options.site_connect.map((connection: any, index: number) => (
                                                <li key={index}>
                                                    <a target={connection.link.target} className={`transition-colors`}
                                                       href={connection.link.href}>
                                                        {parse(connection.icon)}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {options.site_background_credit && (
                <div
                    className={`absolute hidden lg:flex flex-col h-10 align-middle justify-center inset-0 top-auto backdrop-blur-md backdrop-brightness-50 bg-white/10 ${headerState ? 'translate-y-0' : 'translate-y-full'} transition-transform`}>
                    <span className={`inline-block px-2 py-1 text-white text-xs 2xl:text-sm text-center`}>
                       Background {options.site_background_credit}
                    </span>
                </div>
            )}
        </header>
    );
}

export default Header;