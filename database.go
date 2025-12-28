package main

import (
	"path/filepath"
	"time"

	bolt "go.etcd.io/bbolt"
)

const (
	BucketConnections = "connections"
	BucketSettings    = "settings"
	BucketHistories   = "histories"
)

func ConnectDatabase() (*bolt.DB, error) {
	db, err := bolt.Open(filepath.Join(workDirectory, "config.db"), 0600, &bolt.Options{
		Timeout: time.Second * 3,
		Logger:  nil,
	})
	if err != nil {
		return nil, err
	}

	err = db.Update(func(tx *bolt.Tx) error {
		if _, err := tx.CreateBucketIfNotExists([]byte(BucketConnections)); err != nil {
			return err
		}
		if _, err := tx.CreateBucketIfNotExists([]byte(BucketSettings)); err != nil {
			return err
		}
		settingsBucket := tx.Bucket([]byte(BucketSettings))
		if settingsBucket.Get([]byte("system")) == nil {
			err := settingsBucket.Put([]byte("system"), defaultAppSetting.Marshal())
			if err != nil {
				return err
			}
		}
		if _, err := tx.CreateBucketIfNotExists([]byte(BucketHistories)); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		_ = db.Close()
		return nil, err
	}

	return db, nil
}
