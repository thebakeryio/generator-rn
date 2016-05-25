import yeoman from 'yeoman-generator';
import _ from 'lodash';
import changeCase from 'change-case';
import fs from 'fs';
import Handlebars from 'handlebars';
import esprima from 'esprima';
import escodegen from 'escodegen';
import escodegenOptions from './escodegen';
import esprimaOptions from './esprima';
import namingConventions from './naming';
import shell from 'shelljs';

module.exports = yeoman.Base.extend({
  constructor() {
    yeoman.Base.apply(this, arguments);

    this.appDirectory = 'app';
    this.namingConventions = namingConventions;
    this.Handlebars = Handlebars;

    this.Handlebars.registerHelper('uppercaseFirst', text => changeCase.upperCaseFirst(text));

    this.template = (source, destination, data) => {
      // XX: override Yo's standard template method to use Handlebars templates
      const template = Handlebars.compile(this.read(source));
      const content = template(_.extend({}, this, data || {}));
      this.write(destination, content);
    };

    this.parseJSSource = content => {
      let tree = esprima.parse(content, esprimaOptions);
      tree = escodegen.attachComments(tree, tree.comments, tree.tokens);
      return tree;
    };

    this.generateJSFile = (ast, path) => {
      const content = escodegen.generate(ast, escodegenOptions);
      this.write(path, content);
    };
  },

  _fileExists(fullFilePath) {
    try {
      fs.statSync(fullFilePath);
      return true;
    } catch (e) {
      return false;
    }
  },

  _readFile(fullFilePath) {
    return fs.readFileSync(fullFilePath).toString();
  },

  _dropHBSExtension(fileName) {
    const parts = fileName.split('.hbs');
    return parts.length === 2 ? parts[0] : fileName;
  },

  _listAvailableBoilerPlates() {
    const boilerplatesPath = this.templatePath('./boilerplates');
    return shell.find(boilerplatesPath).filter(function (file) {
      return file.match(/\.js.hbs$/i);
    }).map(file => {
      return (/\/(.*)\.js\.hbs$/ig).exec(
        file.split(boilerplatesPath)[1])[1];
    });
  },

  _renderBoilerplate(boilerplate) {
    const t = this.read(`./boilerplates/${boilerplate}.js.hbs`);
    return Handlebars.compile(t)(this);
  },

  dummyMethod() {
    // XX: keep this here so tests can run against base generator
  }
});
