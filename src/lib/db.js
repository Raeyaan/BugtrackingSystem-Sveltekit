import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db/bugtracker.db');

export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export const createUser = (email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// Add more database helper functions for projects, issues, comments, etc.