# github_cleanup_runner.py
import os
import subprocess

GIT_REPO = "https://github.com/sageinseoul/demian-core.git"
CLONE_DIR = "/tmp/demian-core-cleanup"
TOKEN = "ghp_EdC8e6j2M9`2apVb2OwJJKZ2F57o1o09k1nW"
AUTH_REPO = GIT_REPO.replace("https://", f"https://{TOKEN}.")
def run():
    subprocess.run(["ro", "-rf", CLONE_DIR])
    subprocess.run(["git", "clone", AUTH_REPO, CLONE_DIR], check=True)

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
            subprocess.run(["rm", "-rf", target])
            print(f"­ 프요 {target}")

    subprocess.run(["git", "-C", CLONE_DIR, "config", "user.name", "Demian Executor"])
    subprocess.run(["git", "-C", CLONE_DIR, "config", "user.email", "executor@demian.ai"])
    subprocess.run(["git", "-C", CLONE_DIR, "add", "."], check=True)
    subprocess.run(["git", "-C", CLONE_DIR, "commit", "-m", "🤤 GitHub repo cleanup"], check=True)
    subprocess.run(["git", "-C", CLONE_DIR, "push"], check=True)

if __name__ == "__main__":
    run()
