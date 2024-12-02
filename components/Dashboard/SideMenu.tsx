import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from '@/lib/useTranslations';
import { useUser } from '@/context/userContext';
import UpdatePlan from '@/atoms/updatePlan';

interface MenuItemProps {
  name: string;
  path: string;
  icon: string;
  children?: MenuItemProps[];
}

const SideMenu: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { translate } = useTranslation();

  const menuItems: MenuItemProps[] = [
    {
      name: `${translate('pages', 'dashboard')}`,
      path: '/dashboard',
      icon: 'fa-solid fa-grip-vertical'
    },
    {
      name: `${translate('pages', 'orders')}`,
      path: '/dashboard/orders',
      icon: 'fa-solid fa-list'
    },
    {
      name: `${translate('pages', 'products')}`,
      path: '/dashboard/products',
      icon: 'fa-solid fa-basket-shopping'
    },
    {
      name: `${translate('pages', 'settings')}`,
      path: '/dashboard/settings',
      icon: 'fa-solid fa-gear'
    }
  ];

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
    <div className="logo">
    <Link href="/dashboard" className="logo">spyshark<span>_</span></Link>
    </div>
    <div className="menu">
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${isActive(item.path) ? 'active' : ''} ${activeIndex === index ? 'open' : ''} ${item.children ? 'has-child' : ''}`}
          >
            <div className="item" onClick={() => handleItemClick(index)}>
              <Link href={item.path}><i className={item.icon}/><span>{item.name}</span></Link>
              {item.children && <i className="fa-solid fa-arrow-down"/>}
            </div>
            {item.children && activeIndex === index && (
              <ul>
                {item.children.map((child, childIndex) => (
                  <li key={childIndex} className={`${isActive(child.path) ? 'active' : ''}`}>
                    <Link href={child.path}>{child.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
    {/* {user?.plan === 'free' && (<UpdatePlan/>)} */}
    </>
  );
};

export default SideMenu;
