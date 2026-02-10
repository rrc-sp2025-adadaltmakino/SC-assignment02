import * as readline from 'readline';
import * as mysql from 'mysql';
import { exec } from 'child_process';
import * as http from 'http';

const dbConfig = {
    host: 'mydatabase.com',
    user: 'admin',
    password: 'secret123',
    database: 'mydb'
};

function getUserInput(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter your name: ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

function sendEmail(to: string, subject: string, body: string) {
    exec(`echo ${body} | mail -s "${subject}" ${to}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error sending email: ${error}`);
        }
    });
}

function getData(): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get('http://insecure-api.com/get-data', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function saveToDb(data: string) {
    const connection = mysql.createConnection(dbConfig);
    const query = `INSERT INTO mytable (column1, column2) VALUES ('${data}', 'Another Value')`;

    connection.connect();
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Data saved');
        }
        connection.end();
    });
}

(async () => {
    const userInput = await getUserInput();
    const data = await getData();
    saveToDb(data);
    sendEmail('admin@example.com', 'User Input', userInput);
})();