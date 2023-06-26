import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../404.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const Error404Page = () => (
    <div className='root404'>
        <h1>404 Not Found</h1>
        <section className={cx('error-container')}>
            <span className={cx('four')}>
                <span className="screen-reader-text">4</span>
            </span>
            <span className={cx('zero')}>
                <span className="screen-reader-text">0</span>
            </span>
            <span className={cx('four')}>
                <span className="screen-reader-text">4</span>
            </span>
        </section>
        <div className={cx('link-container')}>
            <Link to="/" className={cx('more-link')}>
                Back to home
            </Link>
        </div>
    </div>
);

export default Error404Page;
