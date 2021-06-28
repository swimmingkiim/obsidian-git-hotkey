import { exec, execSync } from "child_process"; 
import { getTimeStampInKST } from "./utils";

interface CommandResult {
    stdout: string;
    stderr: string;
}

export const executeShellCommand = async (command: string, cwd?: string) => {
    return exec(command, {cwd})
}

const updateGitRepo = async (gitRepoPath:string) => {
    try {
        await executeShellCommand("git add .", gitRepoPath)
        await executeShellCommand(`git commit -am "${getTimeStampInKST()}"`, gitRepoPath)
        await executeShellCommand("git push origin main", gitRepoPath)
        return "done"
    } catch (error) {
        return "something went wrong, please try it manually"
    }
}

export default updateGitRepo;