const mongoose = require('mongoose')

module.exports = () => {
  const connect = () => {
    mongoose.connect('mongodb://root:1234@localhost:27017/admin', {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    }, (err) => {
      if(err) console.error(err);
      else console.log('MongoDB Connected...');
    });
  };

  connect();

  mongoose.connection.on('error', (error) => {
    console.log('몽고디비 연결 에러:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
  });

  require('./User');
};
