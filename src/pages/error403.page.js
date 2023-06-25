import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../403.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Error403Page = () => (
    <div className={cx('body')}>
        <div className={cx('wrapper')}>
            <div class="box">
                <h1>403 Forbidden</h1>
                <p>Sorry, it's not allowed to go beyond this point!</p>
                <p>
                    <Link href="/">Please, go back this way.</Link>
                </p>
            </div>
        </div>
    </div>
);

export default Error403Page;
