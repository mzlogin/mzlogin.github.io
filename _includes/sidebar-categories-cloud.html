<h3>Categories Cloud</h3>
{% assign first = site.categories.first %}
{% assign max = first[1].size %}
{% assign min = max %}
{% for category in site.categories offset:1 %}
  {% if category[1].size > max %}
    {% assign max = category[1].size %}
  {% elsif category[1].size < min %}
    {% assign min = category[1].size %}
  {% endif %}
{% endfor %}
{% assign diff = max | minus: min %}

{% if diff == 0 %}
  {% assign diff = 1 %}
{% endif %}

{% for category in site.categories %}
  {% assign temp = category[1].size | minus: min | times: 36 | divided_by: diff %}
  {% assign base = temp | divided_by: 4 %}
  {% assign remain = temp | modulo: 4 %}
  {% if remain == 0 %}
    {% assign size = base | plus: 9 %}
  {% elsif remain == 1 or remain == 2 %}
    {% assign size = base | plus: 9 | append: '.5' %}
  {% else %}
    {% assign size = base | plus: 10 %}
  {% endif %}
  {% if remain == 0 or remain == 1 %}
    {% assign color = 9 | minus: base %}
  {% else %}
    {% assign color = 8 | minus: base %}
  {% endif %}
  <a href="{{ site.url }}/categories/#{{ category[0] }}" style="font-size: {{ size }}pt; color: #{{ color }}{{ color }}{{ color }};">{{ category | first }}</a>
{% endfor %}

<!-- ref http://liberize.github.io/tech/jekyll-tag-cloud.html -->
