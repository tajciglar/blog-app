const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

passport.serializeUser((user, done) => {
    done(null, user.user_id);
 });


passport.deserializeUser((id, done) => {
    prisma.user.findUnique({
      where: {
        id: id
      }  
    })
    .then(user => {
            done(null, user);
    })
    .catch(err => done(err));   
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: username
                }
            })

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password" })
            }
        
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);
module.exports = passport;