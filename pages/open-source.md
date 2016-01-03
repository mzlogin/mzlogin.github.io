---
layout: default
title: Open Source Projects
keywords: 开源,open-source,GitHub,开源项目
description: 开源改变世界。我是一个热衷于开源的人，也多多少于参与与创建了一些开源项目，希望在开源这条路上能做出更大更多的贡献。
permalink: /open-source/
---
<section class="container">
    <header class="text-center">
        <h1>Open Source Projects</h1>
        <p class="lead">I have <span class="repo-count">0</span> projects on Github</p>
    </header>
    <div class="repo-list">
      <div class="blankslate"><h3>Loading...</h3></div>
    </div>
</section>
<div id="repo-template" style="display:none">
  <li class="collection-card">
      <a href="[repo.html_url]" target="_blank" class="collection-card-image geopattern" data-pattern-id="[repo.name]">
          <h3 class="collection-card-title">[repo.name]</h3>
      </a>
      <p class="collection-card-body">[repo.description]</p>
      <div class="collection-card-meta">
        <span class="meta-info tooltipped tooltipped-n [repo.language]" aria-label="[repo.language] project">[repo.language]</span>
        <span class="meta-info tooltipped tooltipped-n" aria-label="[repo.stargazers_count] stars">
            <span class="octicon octicon-star"></span> [repo.stargazers_count]</span>
        <span class="meta-info tooltipped tooltipped-n" aria-label="[repo.forks_count] forks">
            <span class="octicon octicon-git-branch"></span> [repo.forks_count]
        </span>
        <span class="meta-info tooltipped tooltipped-n" aria-label="最后更新于：[repo.updated_at]">
            <span class="octicon octicon-clock"></span>
            <time datetime="[repo.updated_at]" title="[repo.updated_at]"> [repo.updated_at]</time>
        </span>
      </div>
  </li>
</div>
<script src="/assets/js/underscore-min.js"></script>
<script>
    $(document).ready(function(){
        var repoListWrap = $('.repo-list');
        var repoList = $('<ul class="collection-listing clearfix"></ul>');
        var repoCount = 0;

        $.get('https://api.github.com/users/mzlogin/repos?type=owner',
          function(repos){
            if (!repos) {
              repoListWrap.html('<div class="blankslate"><h3>加载失败</h3><p>请刷新或稍后再试...</p></div>');
            };
            
            repos = _.sortBy(repos, function(repo){
                return - (repo.stargazers_count + repo.forks_count + repo.watchers_count);
            });
            
            repos.forEach(function(repo){
                if (repo.fork) return;
                repoCount++;

                var date = new Date(repo.updated_at);

                // repo.updated_at = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes();
                repo.updated_at = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay();
                repo.language = repo.language || 'unknown';

                var repoTemplate = $('#repo-template').html();
                var item = repoTemplate.replace(/\[(.*?)\]/g, function(){
                    return eval(arguments[1]);
                });

                repoList.append(item);
            });

            repoListWrap.html(repoList);
            $('.repo-count').html(repoCount);

            $('.geopattern').each(function(){
              $(this).geopattern($(this).data('pattern-id'));
            });
        });
    });
</script>
