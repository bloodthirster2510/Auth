import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('test.db');

db.transaction(tx => {
    tx.executeSql(`
        create table if not exists Account
        (
            TaiKhoan integer primary key not null,
            MatKhau text not null
        )
    `);
});

export async function findAll() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from Account`,
                [],
                (_, { rows }) => resolve(rows._array),
                (_, error) => reject(error)
            );
        });
    });
}

export async function findById(taiKhoan) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from Account where TaiKhoan = ?`,
                [taiKhoan],
                (_, { rows }) => resolve(rows._array[0]),
                (_, error) => reject(error)
            );
        });
    });
}

export async function create(taiKhoan, matKhau) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `insert into Account (TaiKhoan, MatKhau) values (?, ?)`,
                [taiKhoan, matKhau],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
}

export async function edit(taiKhoan, matKhau) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `update Account set MatKhau = ? where TaiKhoan = ?`,
                [matKhau, taiKhoan],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
}

export async function destroy(taiKhoan) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `delete from Account where TaiKhoan = ?`,
                [taiKhoan],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
}
