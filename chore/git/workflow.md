# 本项目使用的 git workflow

# 
```
# 主要type
feat:     增加新功能
fix:      修复bug

# 特殊type
docs:     只改动了文档相关的内容
style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
build:    构造工具的或者外部依赖的改动，例如webpack，npm
refactor: 代码重构时使用
revert:   执行git revert打印的message

test:     添加测试或者修改现有测试
perf:     提高性能的改动
ci:       与CI（持续集成服务）有关的改动
chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动
```


## 拉取主分支代码
```
git pull -r
```

## 新分支
type/分支名
 - e.g.: feat/newFeature

## 个人分支合并到主分支
```
先 rebase 主分支
git checkout main && git pull -r

# 切换到你要合并的分支（e.g.: feat/newFeature）
git checkout feat/newFeature
git rebase main # 先找到你的分支和 main 分支的相同公共祖先，然后把你在该 commit 之后的所有 commit 都从 main 分支的最后一个提交开始重新提交一遍（有冲突就解决冲突）

git push -f

// 创建个 pr 选择 `Squash and merge`(会在提交记录后面加上 pr 的序号) (推荐)
// 如果选择 rebase 则相当于直接在目标分支上多一个 commit
```