var request = require('request');
var html_strip = require('htmlstrip-native').html_strip;

const grades = {
  a: "Proceed to safe URL!",
  b: "Use caution at this page.",
  c: "Things are heating up. Beware.",
  d: "Not recommended for you.",
  e: "Do not go to this page."
};

const orange_slice = {
    danger_words: [],
    set_danger_words: function(words) {
        this.danger_words = words;
    },
    // Get a list of all words from the specimen (string)
    get_word_list: function(specimen) {
        return specimen
            .replace(/[.,?!;()"'-]/g, " ")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .split(" ");
    },
    // Get a dictionary of unique words and the number of
    // occurrences from a word list (array)
    get_word_dictionary: function(wordlist) {
        var worddict = {};
        wordlist.forEach(function (word) {
            if (!(worddict.hasOwnProperty(word))) {
                worddict[word] = 0;
            }
            worddict[word]++;
        });

        return worddict;
    },
    // The main logic to determine how 'unsafe' a page is
    process_specimen: function(specimen_body) {
        // options for stripping
        const stripOptions = {
            include_script: false,
            include_style: false,
            compact_whitespace: true,
            include_attributes: { 'alt': true }
        };

        // Strip HTML
        body = html_strip(specimen_body, stripOptions).toLowerCase();

        // Get the list of words on the page, with counts of
        // occurences
        wordlist = this.get_word_list(body);
        worddict = this.get_word_dictionary(wordlist);
        
        // Track a list of the danger words that were found in the
        // content, and how many times.
        found_danger_words = [];
        for (i in this.danger_words) {
            danger_word = this.danger_words[i].toLowerCase();

            if (worddict.hasOwnProperty(danger_word)) {
                found_danger_words[danger_word] = worddict[danger_word];
            }
        }

        // This will display the list of words on the page and
        // their counts
        console.log(JSON.stringify(worddict));

        console.log("Total words on page: ", wordlist.length);
        console.log("Total unique words on page: ", Object.keys(worddict).length);
        console.log("Danger words found: ", found_danger_words);

        return {
          grade: 'A',
          total_words: wordlist.length,
          unique_words: Object.keys(worddict).length,
          danger_words_found_count: Object.keys(found_danger_words).length,
          found_danger_words: found_danger_words
        };
    },
    // Process a URL and get the orange slice score
    process_url: function(url) {
        var self = this;

        return new Promise(resolve => {
          console.log("Fetching URL '" + url + "'");
          if (!url) {
            console.log('ERROR! No URL specified');
            resolve(self.process_specimen(''));
            return;
          }
          request(url, function(error, response, body) {
              //console.log('statusCode:', response && response.statusCode);
              if (error) {
                  console.log('ERROR!', error);
                  process.exit(1);
              }
              resolve(self.process_specimen(body));
          });
        });
    }
};

module.exports = orange_slice;
