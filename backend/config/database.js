import sequelize from 'sequelize' // package untuk mysql

const db = new sequelize('auth_db','root','root', {
    host : 'localhost',
    dialect : 'mysql'
})

export default db