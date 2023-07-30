// npx sequelize model:generate --name Todo --attributes name:string,isDone:boolean
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    name: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN
  }, {});
  Todo.associate = function (models) {
    // associations can be defined here
  };
  return Todo;
};