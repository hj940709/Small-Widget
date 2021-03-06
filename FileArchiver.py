import sys,os,argparse,time,shutil
import numpy as np
# os.system("ls -lR %s|grep ^-|wc -l"%root)

def verbosePrint(msg):
    print(msg)



def getFileList(root):
    splitor = "/"
    filelist = []
    for dirpath, subdirs, files in os.walk(root):
        for filename in files:
            if "." not in filename or filename.endswith(".paf") or\
                    filename.endswith(".html") or filename.endswith(".html.gz"):
                file = {}
                file["name"] = filename
                file["path"] = dirpath
                file["size"] = os.stat(dirpath + splitor + filename).st_size
                tmp = dirpath.split(splitor)
                file["source"] = tmp[-1]
                file["compressed"] = filename.endswith(".html.gz")
                try:
                    file["time"] = time.strptime("-".join([tmp[-4], tmp[-3], tmp[-2]]), "%Y-%m-%d").time
                except Exception as e:
                    file["time"] = os.stat(dirpath + splitor + filename).st_ctime
                verbosePrint(file)
                filelist.append(file)
    return np.array(sorted(filelist,key=lambda x:x["name"]))

def getUniqueFile(filelist,num_file_type=3):
    def analyzePaf(array, condition):
        matrix = np.zeros((array.shape[0], 2))
        for i in range(array.shape[0]):
            for c in condition:
                matrix[i, condition.index(c)] = array[i][c]
        for c in condition:
            if matrix[:, condition.index(c)].sum() / matrix[0, condition.index(c)] != matrix.shape[0]:
                if c == "size":
                    verbosePrint(c)
                    return {"source": array[np.argmax(matrix[:, condition.index(c)])]["source"]}
                elif c == "time":
                    verbosePrint(c)
                    return {"source": array[np.argmin(matrix[:, condition.index(c)])]["source"]}
        return {"source": array[0]["source"]}  # output the first one if everything are identical
    def fileFilter(array, selected, offset=0):
        index = []
        for i in range(array.shape[0]):
            if array[i]["source"] == selected["source"]:
                index.append(i)
        return np.array(index) + offset
    index = []
    i=0
    while i<len(filelist):
        docno = filelist[i]["name"].split(".")[0]
        if docno != filelist[i+1]["name"]:
            #no duplicate
            while docno in filelist[i]:
                index.append(i)
                i += 1
        else:
            duplicate_count = 0
            while docno == filelist[i+duplicate_count+1]["name"]:
                duplicate_count += 1
            verbosePrint("detect duplicate:"+str(duplicate_count)+"at"+str(i))
            tmp = filelist[i:i+num_file_type+duplicate_count*num_file_type]
            verbosePrint(tmp[-duplicate_count-1:-1])
            #Assume other file are identical
            #Therefore only analyze paf
            #Priority: size > time
            selected = analyzePaf(tmp[-duplicate_count-1:-1],["size","time"])
            for j in fileFilter(tmp, selected, i):
                index.append(j)
            i += duplicate_count*num_file_type+num_file_type
    return np.array(index)




def cleanup(root):
    for dirpath, subdirs, files in os.walk(root):
        for filename in files:
            if "." not in filename or filename.endswith(".paf") or\
                    filename.endswith(".html"):
                continue
            elif filename.endswith(".html.gz"):
                zipFile = gzip.open(os.path.join(dirpath,filename),"rb")
                unCompressedFile = open(os.path.join(dirpath,filename[:-3]),"wb")
                decoded = zipFile.read()
                unCompressedFile.write(decoded)
                zipFile.close()
                unCompressedFile.close()
                os.remove(os.path.join(dirpath,filename))
            else:
                os.remove(os.path.join(dirpath,filename))

def compress(src,dst):
    for d in os.listdir(src):
        verbosePrint("Source"+os.path.join(root,d))
        shutil.make_archive(os.path.join(root,d), 'gztar', base_dir=os.path.join(root,d))


if __name__ == '__main__':
    argparser = argparse.ArgumentParser(description='Give root of your directory')
    argparser.add_argument('--verbose', dest='verbose', action='store_true', help='show debug print')
    argparser.add_argument('src',dest='src', type=str, help='Source Root directory')
    argparser.add_argument('dst', dest='dst', type=str, help='Destination Root directory')
    args = argparser.parse_args()
    if not arg.verbose:
        verbosePrint = lambda x: None
    src = args.src
    #src = "/cs/puls/Corpus/Business/Puls/2016/10"
    #tmp = "/cs/puls/tmp/business-corpus/"
    print(src)
    #cleanup(src)
    #compress(src,tmp)

    


