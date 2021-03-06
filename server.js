const express = require('express')
const bodyParser = require('body-parser')
const forceSsl = require('force-ssl-heroku');
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware')
const nextI18next = require('./i18n')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    
    const server = express();
    const api = require('./api/queries');
    const mails = require('./api/mails');
    
    server.use(nextI18NextMiddleware(nextI18next));
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(forceSsl);

    server.get('/api/locationsearch', api.getLocationsBySubstring);
    server.get('/api/locationdata', api.getLocationData);
    server.get('/api/coursesdata', api.getCoursesData);
    server.get('/api/coursedata', api.getCourseData);
    server.get('/api/courseimages', api.getCourseImages);
    server.get('/api/popularlocations', api.getPopularLocationsData);
    server.get('/api/featuredcourses', api.getFeaturedCoursesData);

    server.post('/mails/successfulbooking', mails.successfulBooking);

    server.get('/', (req, res) => {
      const actualPage = '/'
      const queryParams = {}
      
      app.render(req, res, actualPage, queryParams)
    })

    server.get('/searchresults', (req, res) => {
      const actualPage = '/searchresults'
      const queryParams = { 
        location: req.params.location,
        subject: req.params.subject
      }

      app.render(req, res, actualPage, queryParams)
    })

    server.get('/course', (req, res) => {
      const actualPage = '/course'
      const queryParams = { 
        id: req.params.id
      }
      
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    if (dev) {
      server.listen(3000, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
      })
    } else {
      server.listen(process.env.PORT || 5000)
    }
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })