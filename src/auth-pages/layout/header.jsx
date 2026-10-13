import React from 'react'
import { useLocation } from 'react-router-dom'

const Header = ({ user }) => {

    const location = useLocation();
    const path = location.pathname.replace('/', '').replace('-', ' ');

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
            <div className="grid md:flex md:items-end md:justify-between gap-0 p-4">
              <div className='grid'>
                <h1 className="text-2xl hidden md:block font-bold text-accent capitalize">{path}</h1>
                <span className="hidden md:block text-sm text-muted-foreground mt-1">
                  {user && `${user?.organization} | ${user?.organization_category}`}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mt-10 md:mt-1">
                  {user && `Welcome back, ${user?.name || user?.email}!`}
                </p>
              </div>
            </div>
        </header>
    )
}

export default Header