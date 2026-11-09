import * as $ from 'jquery';
import Post from '@models/Post';
// import json from './assets/json.json';
// import xml from './assets/data.xml';
// import csv from './assets/data.csv';
import WebpackLogo from '@/assets/webpack-logo.png';
import React from 'react';
//! ReactDOM.render is no longer supported in React 18. Use createRoot instead. 
// import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';

import './bable.js';
import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';

const post = new Post('Webpack Post Title', WebpackLogo);
$('pre').addClass('code').html(post.toString());

const root = createRoot(document.getElementById('app'));

const App = () => (
    <div className="container">
        <h1>Webpack Course</h1>
        <hr />
        <div className="logo" />
        <hr />
        <pre />
        <hr />
        <div className="box">
            <h2>Less</h2>
        </div>

        <div className="card">
            <h2>SCSS</h2>
        </div>
    </div>
);

// root.render(<App />, document.getElementById('app'));
root.render(<App />);

// console.log('json :>> ', json);
// console.log('xml :>> ', xml);
// console.log('csv :>> ', csv);
console.log('App :>> ', App);
console.log('React :>> ', React.version);