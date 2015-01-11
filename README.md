# ng-multi-transclude

Richer transclusion for AngularJS; see <http://zachsnow.com/blog/2013/angularjs-multi-transclusion/>
or check out this [demo](http://plnkr.co/edit/kMH2lYJ20LqNjgqwJ6W6?p=preview).

This is still somewhat of an experiment.

## Dependencies

1. AngularJS (duh).

## Installation

* Load `multi-transclude.js`.

* Add `multi-transclude` as a dependency to your angular module.

```javascript
  angular.module('yourModule', [
    // ... other dependencies ...
    'multi-transclude'
  ]);
```

* Use `ng-multi-transclude`, `ng-multi-template`, and
  `ng-multi-transclude-controller` in your templates.

## Description

Transclusion in AngularJS allows you to write a directive that is
parameterized by a block of HTML.  *Multi-transclusion* allows you to
write directives that are parameters by *multiple* blocks of HTML.

Consider an example: a fancy cancel button that has a
text-replaced icon and a title that should be styled specially.
In the former case, we might have a directive `ng-button` that populates
the following template:

```html
  <button class="ng-button">
    <i class="cancel-icon"></i>
    <span ng-transclude class="title"></span>
  </button>
```

And use it thus:

```html
  <div ng-button>
    Are you <b>sure</b> you want to delete the thing?
  </div>
```

Which would generate:

```html
  <button class="ng-button">
    <i class="cancel-icon"></i>
    <span>
      Are you <b>sure</b> you want to delete the thing?
    </span>
  </button>
```

With multi-transclusion, you can write directives whose templates
have several "holes" that you can populate individually, by name.
Let's expand our example to a directive `ng-multi-button`, that
has both a title and a *hint*, both of which should be allowed
to be arbitrary templates:

```html
  <button class="ng-multi-button">
    <div>
      <i class="cancel-icon"></i>
      <span ng-multi-transclude="title" class="title"></span>
    </div>
    <div>
      <i class="hint-icon"></i>
      <span ng-multi-transclude="hint" class="hint"></span>
    </div>
  </button>
```

Now we can populate each block independently, reusing the structure
in the directive's template instead of forcing each use
of `ng-button` to include its own hint.

```html
  <div ng-multi-button>
    <span name="title">
      Are you <b>sure</b> you want to delete the thing?
    </span>
    <span name="hint">
      When you delete the thing it's gone <i>forever</i>,
      so be extra careful!
    </span>
  </div>
```

## Usage

The `multi-transclude` library includes 3 directives: the eponymous
`ng-multi-transclude`, along with `ng-multi-template` and `ng-multi-transclude-controller`.

The simplest case is when you'd like to define a template (either inline
in a directive definition, via `template`, or in a `<script />` tag via `templateUrl`)
that allows multi-transclusion.  Simply define your template thus, naming
various multi-transclude blocks.

```html
    <script type="text/ng-template" id="some-template">
      <h1>Some template</h1>
      <div class="main-content" ng-multi-transclude="some-block"></div>
      <div class="some-chrome">
        <div class="secondary-content" ng-multi-transclude="another-block"></div>
      </div>
    </script>
```

When you want to instantiate your template, use the `ng-multi-template` directive,
populating the named blocks.  Note that you *must* declare your block parameters
as immediate children of the `ng-multi-template` usage.

```html
  <div ng-multi-template="some-template">
    <div name="some-block">...</div>
    <div name="another-block">...</div>
  </div>
```

Sometimes you'd like to define your own directive that, along with a multi-transclusion
template, has a fancy link function.  To do that you need to use `ng-multi-transclude-controller`
to "wrap" all instances of `ng-multi-transclude` in your template:

```javascript
  app.directive('ngAnotherDirective', function(){
    return {
      templateUrl: 'another-template',
      link: function(scope, element, attrs){
        // Some fancy logic.
      }
    }
  });
```

```html
  <script type="text/ng-template" id="another-template">
    <h1>Another template</h1>
    <div ng-multi-transclude-controller>
      <div class="main-content" ng-multi-transclude="some-block"></div>
      <div class="some-chrome">
        <div class="secondary-content" ng-multi-transclude="another-block"></div>
      </div>
    </div>
  </script>
```

Then you can use your new custom directive as follows:

```html
  <div ng-another-directive>
    <div name="some-block">...</div>
    <div name="another-block">...</div>
  </div>
```

You can provide default block content in your template, too; this content will
be used if there is no matching block passed to the directive:

```html
    <script type="text/ng-template" id="some-template">
      <div ng-multi-transclude="required-block"></div>
      <div ng-multi-transclude="optional-block">
        And here's some default content.
      </div>
    </script>
```

To see something like this in action, check out this
[demo](http://plnkr.co/edit/kMH2lYJ20LqNjgqwJ6W6?p=preview).
