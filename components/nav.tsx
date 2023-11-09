const Nav = ({ menu }: { menu: any }) => {
    if (!menu || !Array.isArray(menu)) {
        console.error('Invalid menu data:', menu);
        return null;
    }

    // Create a hierarchy based on the parent-child relationship
    const createHierarchy = (items: any, parentId = '0') =>
        items
            .filter((item: any) => item.menu_item_parent === parentId)
            .map((item: any) => ({ ...item, children: createHierarchy(items, item.ID) }));

    // Create the hierarchy for rendering
    const hierarchy = createHierarchy(menu);

    // Render a menu item and its children
    const renderMenuItem = (item: any) => (
        <li key={item.ID}>
            <a
                href={item.url}
                className={`relative block leading-loose text-bright-sun-400 pr-2 hover:text-black hover:bg-bright-sun-400 hover:pl-4 transition-[all]`}
            >
                {item.menu_item_parent > 0 && (
                    <svg viewBox="0 0 492 726" height={16} className={`absolute top-0 -left-4 bottom-0 my-1.5 fill-white/10`}>
                        <path d="M173 552h318v173H0V0h173v552Z"/>
                    </svg>
                )}
                {item.title}
            </a>
            {item.children.length > 0 && <ul className={`flex flex-col pl-4 list-none`}>{item.children.map((child: any) => renderMenuItem(child))}</ul>}
        </li>
    );

    // Render the top-level menu items
    const renderMenuItems = hierarchy.filter((item: any) => item.menu_item_parent === '0');

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
