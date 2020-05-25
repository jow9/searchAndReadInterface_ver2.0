#!C:\Ruby25-x64\bin\ruby.exe
# -*- coding: utf-8 -*-
Encoding.default_external = 'utf-8'

require "cgi"
require "json"
require "csv"

cgi = CGI.new()

print "Content-type: text/html\n\n"

if (false)
  print cgi["cmd"]+"<BR/>\n"
  print cgi["data"]+"<BR/>\n"
  print cgi["fn"]+"<BR/>\n"
end

if (cgi['cmd'] == 'erase')
  fh = open('../src/'+cgi['fn'], "w")
  fh.close
elsif (cgi['cmd'] == 'read')
  fh = open('../src/'+cgi['fn'], "r")
  print fh.read
  fh.close
elsif (cgi['cmd'] == 'transAll')
  readfh = open('../src/list/readArticleList.txt', "r")
  noreadfh = open('../src/list/noreadArticleList.txt', "a")
  data = readfh.read
  noreadfh.puts data
  print data

  readfh = open('../src/list/readArticleList.txt', "w")#リストをすべて消す
  readfh.close
  noreadfh.close
elsif (cgi['cmd'] == 'add')
  fh = open('../src/'+cgi['fn'], "a")
  #fh.printf(cgi['data']+"\n")
  fh.puts cgi['data']
  fh.close
elsif (cgi['cmd'] == 'readArray')
  articleArray = cgi['fn'].split(",")
  result = {}
  data_array = CSV.read("../src/article/dummy_article.csv")

  for id in articleArray do
    data_array.each {|data|
      if (data.include? id)
        result.store(id, data[1] + "\n" + data[2]) #データの一行目をタイトル、2行目以降を本文として扱う
      end
    }

    #file_name = '../src/article/' + id + '.txt'
    #fh = open(file_name, "r")#ここと38行でエラーが発生している。原因は読み込んだデータがJSONにする際にUTF-8以外の文字列を含んでいるから上手くエンコードされない
    #result.store(id, fh.read.force_encoding("UTF-8"))
    #fh.close
  end
  print result.to_json
elsif (cgi['cmd'] == 'logSave')
  fh = open('../src/logData/log.txt', "a")
  fh.puts cgi['data']
  fh.close
elsif (cgi['cmd'] == 'test')
  search_word = "001"
  result = []
  data_array = CSV.read("../src/test/article/article_test.csv")
  data_array.each {|data|
    result.push data if data.include? search_word
  }
  p result
else
  fh = open('../src/'+cgi['fn'], "r")
  olddata = fh.read#readによって持ってきたデータはテキストデータとして扱われる
  newdata = olddata.gsub(/#{cgi['data']}\n/, '')#指定した文字列を置換する
  fh = open('../src/'+cgi['fn'], "w")
  fh.print newdata
  fh.close
end
