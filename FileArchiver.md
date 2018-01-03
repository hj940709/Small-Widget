## Goal
* Clean up the directory
* Merge duplicate files
* Unzip compressed file
* Zip all the file
* Remove temp files and other disposable files
## TODO
1. Traverse 
   * Read file list  -  os.walk("/tmp")
   * Remove disposable files
   * Unzip compressed files
2. Identify
   * Time > float
   
      Directory 
         - time.strptime("2017-12-01","%Y-%m-%d")
         - time.strftime(format[, t])
      Meta data - os.stat("filname").st_ctime -float
      
   * Source (Unique)
   
      Directory
3. Remove duplicate file from list
4. Compress
## Tuple
(docno, time, source, path)

## Reduce
Early time first

More source info first

#### Python3
#### /cs/puls/Corpus/Business/Puls
