export PATH := node_modules/.bin:$(PATH)

.PHONY: test

watch:
	tsc -w

compile:
	tsc

test:
	egg-bin test
