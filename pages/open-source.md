---
layout: default
title: Open Source Projects
keywords: 开源,open-source,GitHub,开源项目
description: 开源改变世界。
permalink: /open-source/
---

{% if site.github.public_repositories != null %}
{% assign sorted_repos = (site.github.public_repositories | sort: 'stargazers_count') | reverse %}

<section class="container">
    <header class="text-center">
        <h1>Open Source Projects</h1>
        <p class="lead">I have <span class="repo-count">{{ sorted_repos.size }}</span> projects on Github</p>
    </header>
    <div class="repo-list">
        <!-- Check here for github metadata -->
        <!-- https://help.github.com/articles/repository-metadata-on-github-pages/ -->
        {% for repo in sorted_repos %}
        <a href="{{ repo.html_url }}" target="_blank" class="one-third-column card text-center">
            <div class="thumbnail">
                <div class="card-image geopattern" data-pattern-id="{{ repo.name }}">
                    <div class="card-image-cell">
                        <h3 class="card-title">
                            {{ repo.name }}
                        </h3>
                    </div>
                </div>
                <div class="caption">
                    <div class="card-description">
                        <p class="card-text">{{ repo.description }}</p>
                    </div>
                    <div class="card-text">
                        <span class="meta-info" title="{{ repo.stargazers_count }} stars">
                            <span class="octicon octicon-star"></span> {{ repo.stargazers_count }}
                        </span>
                        <span class="meta-info" title="{{ repo.forks_count }} forks">
                            <span class="octicon octicon-git-branch"></span> {{ repo.forks_count }}
                        </span>
                        <span class="meta-info" title="Last updated：{{ repo.updated_at }}">
                            <span class="octicon octicon-clock"></span>
                            <time datetime="{{ repo.updated_at }}">{{ repo.updated_at | date: '%Y-%m-%d' }}</time>
                        </span>
                    </div>
                </div>
            </div>
        </a>
        {% endfor %}
    </div>
</section>
{% endif %}
