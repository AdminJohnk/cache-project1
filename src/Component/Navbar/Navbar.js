import React, { Component } from 'react'
import style from './Navbar.module.css'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
    render() {
        return (
            <div className='container-fluid'>
                <div className={style.navbar + " navbar"}>
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link className={style.nav_link + " nav-link"} aria-current="page" to="/">Direct Mapped Cache</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={style.nav_link + " nav-link"} to="/Fully-Associative-Cache">Fully Associative Cache</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={style.nav_link + " nav-link"} to="/2-Way-SA">2-Way SA </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={style.nav_link + " nav-link"} to="/4-Way-SA">4-Way SA</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
