const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true, //null값들은 고유한것으로 함.
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100), //해쉬화 되었을때도
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'local',  //local : local 로그인 , kakao : 카카오 로그인
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post); // 일대다 관계 유저 하나에 게시글 여러개. ->user.getPosts, user.addPosts 같은 관계 메서드들이 생성됨.
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId', 
      as: 'Followers', //user.addFollowers 가능
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings', //user.addFollowings 가능
      through: 'Follow',
    });  
    db.User.belongsToMany(db.Post, {through :'Like'});
  }  // N : M 관계에서는 모델 이름과 컬럼 이름을 따로 정해야함. , 같은 테이블에서는 as 옵션도 필요함 .as 는 foreignkey 와 반대되는 모델을 가리킴.
  
};