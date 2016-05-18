/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  //define a tanble for all the major web components of the app
  app.components = {
    login: "geo-login",
    dash: "geo-dash",
    feed: "geo-feed",
    create: "geo-create",
    settings: "geo-settings"
  }

  //Table of all the key elements by id used in the app
  app.elements = {
    login: "mainLogin",
    loginData: "firebaseLogin",
    userData: "firebaseUserData",
    main: "mainContainer",
    bar: "mainToolbar",
    editor: "editor",
    feed: "mainFeed",
    collection: "mainCollection",
    create: "mainCreate",
    profilePic: "profilePic",
    profileDialog: ""
  }

  //References to data used by the app
  app.data = {
    uid: "",
    userName: "",
    email: "",
    profileImg: ""
  }

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') { // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    app.baseUrl = '/geoji/';
  }

  //user data
  app.user = {
    hideLogin: false,
    noAccess: true,
    test: "sadasdasdasdcmsdn"
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {

    console.log('Geoji ready to rock!');
    // Need to hide with delay, because all element done load unless
    // it's done like this.
    setTimeout(function() {
      app.hide("mainApp");
    }, 50);

    // setTimeout(function(){
    //   var feedSection = app.element("mainFeed");
    //   var mineSection = app.element("mainCollection");
    //   var feed = document.createElement('geoji-feed');
    //   var mine = document.createElement('geoji-mine');

    //   Polymer.dom(feedSection).appendChild(feed);
    //   Polymer.dom(mineSection).appendChild(mine); 
    // }, 1000);

  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered


  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  app.lastRoute = ["home", "home"];

  app.setLastRoute = function(route) {
    app.lastRoute.unshift(route);
    if (app.lastRoute.length > 2) {
      app.lastRoute.pop();
    }
  }

  app.getLastRoute = function() {
    return app.lastRoute[1];
  }

  //get a hook into a web component on the dom
  //returns a reference to that component.
  app.component = function(component) {

    var c = document.querySelector(component);

    if (c !== null) {

      return c;

    } else {

      console.log("web component " + component + " doesn't exist and cant be wired.");
      return null;

    }
  }

  app.element = function(id) {
    return document.querySelector("#" + id);
  }

  app.feed = function() {
    return app.element(app.elements.feed);
  }

  app.editor = function() {
    return app.element(app.elements.editor);
  }

  app.create = function() {
    return app.element(app.elements.create);
  }

  app.setAttr = function(id, attr, value) {
    app.$[id][attr] = value;
  }

  app.setStyle = function(id, attr, value) {
    var elem = app.element(this.id);
    elem.style[attr] = value;
  }

  // Here we can call a function in any web component via string name.
  // Parameter(s) must be passed in array, if there is more than one.
  app.call = function(id, method, params) {
    var e = app.element(id);
    e[method](params);
  }

  app.getProp = function(id, property) {
    var e = app.element(id);
    return e[property];
  }

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    console.log("wtf");
    app.$.paperDrawerPanel.closeDrawer();
  };

  app.hide = function(id) {
    app.$[id].hidden = true;
  }

  app.show = function(id) {
    app.$[id].hidden = false;
  }

  app.closeMenu = function(e){
    var drawer = app.element("paperDrawerPanel");
    drawer.closeDrawer();
    console.log(drawer);
  }

  // On load the geo-login isnt part of the dom.
  // We wait until is is then the bool is returned.
  app.loginCtrl = function() {

    var method = document.querySelector(app.components.login);

    if (method === null) {

      setTimeout(function() {
        app.loginCtrl();
      }, 100);

    } else {

      var loggedIn = method.getLoggedIn();

      if (loggedIn) {

        return false;

      } else {

        return true;

      }
    }
  }

  app.getUser = function() {
    return app.element(app.elements.login).user;
  }

  app.setUserData = function(key, val) {
    console.log("setting user data: " + key + " to " + val);
    var e = app.element(app.elements.userData);
    var data = {};
    data[key] = val;

    if (e !== null) {
      console.log(e.data);
      e.data = data;
    }
  }

  app.logout = function() {
    app.component("geoji-feed").clearFeed();
    app.element(app.elements.login).logout();
    app.close();
    location.reload();
  }

  app.mainMap = function(on, id) {
    var map = app.element("mainMap");
    var login = app.element("mainLogin");
    
    if (on) {
      app.show("mainMap");
      map.loadGeoji(id);
      setTimeout(function() {
        map.refresh();
      }, 1000);
    } else {
      app.hide("mainMap");
    }
  }

  app.geoji = function(on) {
    if (on) {
      app.hide("mainApp");
      app.show("geoji");
    } else {
      app.hide("geoji");
      app.show("mainApp");
    }
  }

  app.launch = function() {

    app.hide("loginUI");
    app.show("mainApp");

  }

  app.close = function() {
    app.hide("mainApp");
    app.show("loginUI");
  }

})(document);




