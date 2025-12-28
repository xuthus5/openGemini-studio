package main

import (
	"os"
	"path/filepath"
)

var workDirectory = filepath.Join(GetHomeDir(), ".opengemini-studio")

func GetHomeDir() string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "./"
	}
	return homeDir
}

func CreateWorkDirectory() error {
	return os.MkdirAll(workDirectory, 0750)
}
