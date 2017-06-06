# nodejs web framework base on koa & gulp

#run server
  1.cd project root
  
  2.sh begin.sh 
  
  3.http://localhost:3000/


#feature
## gulp less babel livereload
## resource build and min
## yo koa-serve:view  (添加view)



#file structure

    ├── bin
    │   └── www.js   	enter point
    │   └── config.js   env config
    │   └── router.js   user custom router
    │
    ├── sys				framework scripts
    │   └── app.js   	
    │   └── log			project log
    │   └── middelware  framework needed mw
    │   └── gulp-plugin

    │
    ├── controllers
    │   └── index.js   	controller
    │
    ├── resource
    │   ├── js
    │   │	│── page
    │   │	│── cmp
    │   │	│── tools
    │   │	└── lib
    │   └── css
    │       └── index.css
    │   └── less	
    │   └── es6	  		es2015 code	
    │   └── es5   		compiled code
    │
    ├── service         data mock
    │   └── com.a.b 
    │
    ├── test
    │   └── routeSpec.js
    │
    ├── views
    │   ├── public
    │   │		│──head.html
    │   │
    │   ├── template.html
    │   └── index.html
    │
    ├── begin.sh 		start project
    ├── Dockerfile		docker config file
    ├── gulpfile.js
    ├── build.js 		build es5 js (compress & concat)
    └── package.json