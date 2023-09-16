const apiUrl = process.env.API_URL;
const pool = require('../server')
const axios = require('axios');

exports.fetchDataAndStore = async (req, res) => {
    try {
        const response = await axios.get(apiUrl);
        const tickerData = response.data;

        var tickers = Object.values(tickerData);

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tickers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                last DECIMAL NOT NULL,
                buy DECIMAL NOT NULL,
                sell DECIMAL NOT NULL,
                volume DECIMAL NOT NULL,
                base_unit VARCHAR(50) NOT NULL
            );
        `;

        await pool.query(createTableQuery);

        tickers = tickers.slice(0, 10);

        for (const ticker in tickers) {
            if (tickers.hasOwnProperty(ticker)) {
                const { name, last, buy, sell, volume, base_unit } = tickers[ticker];

                const insertQuery = `
                    INSERT INTO tickers (name, last, buy, sell, volume, base_unit)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `;

                await pool.query(insertQuery, [name, last, buy, sell, volume, base_unit]);
            }
        }

        res.status(200).json({ msg: 'Data fetched and stored successfully.', tickers });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.displayData = async (req, res) => {
    try {
        const fetchDataQuery = `
            SELECT * FROM tickers;
        `;

        const result = await pool.query(fetchDataQuery);

        res.status(200).render('index', { data: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};