# Setup Guide for Code Execution

## Issue: Compiler Not Found

If you see an error like **"Compiler not found: gcc"** or **"Compiler not found: g++"**, your C/C++ compilers aren't installed.

## Quick Solutions

### Option 1: Use Python Challenges Only (Quickest)
Python challenges work without additional setup because Python is commonly pre-installed.
Click the language dropdown on a challenge and select **Python** challenges to get started immediately.

### Option 2: Install MinGW for Windows (Recommended for C/C++)

**Steps:**

1. Download MinGW installer from: https://sourceforge.net/projects/mingw/
2. Run the installer and select:
   - mingw32-base
   - mingw32-gcc-g++
3. Install to `C:\mingw`
4. Add to PATH:
   - Open "Environment Variables"
   - Add `C:\mingw\bin` to your system PATH
5. Verify installation:
   ```cmd
   gcc --version
   g++ --version
   ```

### Option 3: Install Visual Studio Build Tools (More Complete)

1. Download: https://visualstudio.microsoft.com/downloads/
2. Choose "Build Tools for Visual Studio"
3. Install C++ development tools
4. Follow setup wizard

### Option 4: Use Windows Subsystem for Linux (WSL)

Advanced option - run Linux tools natively on Windows:
1. Install WSL 2
2. Install Ubuntu or Debian distro
3. Install build-essential: `sudo apt-get install build-essential`

## Verify Setup

After installation, open Command Prompt and test:

```cmd
gcc --version
g++ --version
java -version
python --version
```

All should show version numbers, not "command not found".

## Python - Works Out of the Box

If Python is installed, you can start with Python challenges immediately:

```cmd
python --version
```

If this works, you're ready to code in Python!

## Troubleshooting

**Still getting "Compiler not found"?**
- Restart Command Prompt after installing compilers
- Verify PATH includes compiler installation directory
- Reinstall with "Add to PATH" option enabled

**Need help?**
- Check error message in the Output section
- Try running compiler directly in Command Prompt
- Refer to official installer documentation
