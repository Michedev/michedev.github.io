# Personal Portfolio


# How to add a new page

1. Eventually add under themes/port-hugo/layouts/partials a page part
2. Under themes/port-hugo/layouts/_default add the new page type
3. Under content/ specify a new markdown containing

        ---
        layout: {{ Layout defined under _default/ }}
        title: {{Page title}}
        ---