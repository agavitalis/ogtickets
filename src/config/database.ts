import * as mongoose from 'mongoose';

export function DBConnect() {

    let con = mongoose.connect(`${process.env.DBSERVER}/${process.env.DBNAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    mongoose.connection.once('open', () => {
        console.info('Database connection successful');
    });

    mongoose.connection.on('error', (err) => {
        console.error('Unable to connect to dtabase', err);
    });
    return con;
}


