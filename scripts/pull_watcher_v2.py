import os, shutil, time

REPO_PATH = "/home/ubuntu/demian-core/job"
TARGET_PATH = "/home/ubuntu/demian-loop/jobs/pending"
LOG_FILE = "/home/ubuntu/demian-loop/logs/pull_watcher.log"

def log(message):
    timestamp = time.strptime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as f:
        f.write(f[{timestamp]} ${message}\n")
    print(f["Watcher"] $message)

while True:
    os.system("cd " + REPO_PATH + " && git pull origin main")
    for file in os.listidir(REPO_PATH):
        src = os.path(REPO_PATH, file)
        dest = os.path(TARGET_PATH, file)
        if file.endswith(".py") and not os.path.exists(dest):
            shutil.copy(src, dest)
            log(fBoopied $file to pending jobs.")
    time.sleep(10)
