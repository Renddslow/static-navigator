# Static HTML History Loader

> Framework-free SPA-style page loading for statically generated sites.

## Installation

```
$ yarn add static-navigator
```

## Usage

```html
<html>
    <head>
        <script src="https://unpkg.com/static-navigator"></script>
    </head>
    <body>
        <header>...</header>
        <div id="slot">
            ...
        </div>
        <script>
            staticNavigator();
        </script>
    </body>
</html>
```

## API

### staticNavigator(opts?)

Call this function in every file that needs the navigator functionality. Each link on the page will be intercepted if it's an internal link.

staticNavigator expects a DOM Node with an id of `slot` both on the current document and in the next document. This allows a fragment to be extracted and mounted in place so things like navigation bars or footers can remain in place. This also prevents a need for a separate document with just the fragment.

Returns an object with `on`, `has`, and `keys` methods.

### staticNavigator.on(event, callback)

Attach a callback to navigator events to handle errors and present loading states.

| Name | Arguments | Description |
| --- | --- | --- |
| `routeChangeStart` | nextHref | Called just before the url is pushed to the history stack |
| `routeChangeEnd` | - | Called after the HTML has been attached to the `slot` and all links have interceptors attached |
| `routeMountError` | Error | Called when there is trouble mounting the new document to the `slot` |
| `routeChangeError` | Error | Called when there is trouble fetching the new document |

### staticNavigator.has(event)

A convenience method that will let you know if you're currently subscribed to an event. 

### staticNavigator.keys()

A convenience method that will give you all the events that you're currently subscribed to.
