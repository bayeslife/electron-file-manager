# 

One solution option for management of large data files produced via desktop processes 
is client application which allows uploading of large files along with meta data to the cloud.

The idea with the client is to allow for the capture of meta data along with a resumable and bandwidth controlled upload process to the cloud.

This is an example demonstrates an electron application that
- loads a separately hosted web application intended to capture meta data about the file
- loads a local file based page which allows for capturing the file path of the large data file
- provides a background process to upload the large data file as a set of blocks to the cloud


