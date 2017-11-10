var orange_slice = require('../slicer.js');
var danger_words = require('../danger-words.js');

const { render, redirect } = require('server/reply');

module.exports = {
  home: ctx => {
    return render('home.hbs');
  },
  report: async ctx => {
    const url = ctx.query.url;
    const options = ctx.query.options;

    var danger_word_list = [];

    if (options && options.includes('profanity')) {
      danger_word_list = danger_word_list.concat(danger_words.profanity);
    }

    if (options && options.includes('insults')) {
      danger_word_list = danger_word_list.concat(danger_words.insults);
    }

    orange_slice.set_danger_words(danger_word_list);

    const report = await orange_slice.process_url(url);
    return render('report.hbs', {url: ctx.query.url, options: ctx.query.options, report: report});
  }
};
