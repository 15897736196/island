const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    // dialect: 'mysql',
    // host: 'localhost',
    port: 3306,
    logging: true,//让控制台显示sql信息
    timezone: '+08:00',
    define: {
        timestamps: true,//自动生成 createTime和updateTime
        paranoid: true,//自动生成 deleteTime
        // createdAt: 'created_at',//自定义这些字段名
        // updatedAt: 'updated_at',
        // deletedAt: 'deleted_at',
        // underscored: true,//自动将驼峰写法转换为下划线，看个人习惯设置
    }
})

//测试数据库链接状态
async function connect() {
    try {
        await sequelize.authenticate();
        console.log('数据库链接成功！');
    } catch (error) {
        console.error('无法链接到数据库', error);
    }
}
connect()

sequelize.sync({ force: false })
//force为true会自动检擦模型是否改变，但是会删除原有的表数据，生产环境一定要设为false

module.exports = { sequelize }