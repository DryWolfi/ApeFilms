module.exports = {
    ServerPort: process.env["PORT"] || 3000,
    serverSalt: "D1m4S_0tA5=X",
    DatabaseUrl: 'mongodb://DryWolf:145367496dsa@ds249992.mlab.com:49992/heroku_d6q29vvq' ,
    cloudinary: {
        cloud_name: process.env["cloud_name"] || "dt2ycbolx",
        api_key: process.env["api_key"] || 764362464833349,
        api_secret: process.env["api_secret"] || "2DDkMQNil_2FD6EhmGlHLDIU2rE"
    }
}