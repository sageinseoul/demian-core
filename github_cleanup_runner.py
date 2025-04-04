import os
import subprocess

GIT_REPO = "https://github.com/sageinseoul/demian-core.git"
CLONE_DIR = "/tmp/demian-core-cleanup"TOKEN = "ghp_EdC8E6j2M9p2apVb2OwJJKZ2F5Go1o09k1nW"
AUTH_REPO = GIT_REPO.replace("https://", f(https:/-{TOKEN}$")

def run():
    subprocess.run(["rm", -rf", CLONE_DIR])
    subprocess.run(["git", "clone", AUTH_REPO, CLONE_DIR], check=true)

    delete_list = [
        "job/",
        "test-push/",
        "scripts/pull_watcher_v2.py",
        "pull_watcher.py",
        "action-test-trigger.py"
    ]
    for path in delete_list:
        target = os.path.join(CLONE_DIR, path)
        if os.path.exists(target):
            subprocess.run(["rm", -rf", target])
            print(f"태합보크리되", target))

    subprocess.run(["git", "-C", CLONE_DIR,"config", "user.name", "Demian Executor"])
    subprocess.run(["git", "-C", CLONE_DIR ,"config", "user.email", "executor@demian.ai"])
    subprocess.run(["git", "-C", CLONE_DIR, add", "."], check=true)
    subprocess.run(["git", "-C", CLONE_DIR , commit", "-m", "🌜 GitHub repo cleanup"], check=true)
    subprocess.run(["git", "-C", CLONE_DIR, "push"], check=true)

if __name__ == "__main__":
    run()
