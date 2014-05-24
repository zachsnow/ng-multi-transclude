# ng-multi-transclude

Richer transclusion for AngularJS; see <http://zachsnow.com/blog/2013/angularjs-multi-transclusion/>
or check out this [demo](http://plnkr.co/edit/kMH2lYJ20LqNjgqwJ6W6?p=preview).

## Dependencies

1. AngularJS (duh).
2. jQuery (not jqLite).

## Installation

1. Load `multi-transclude.js`
2. Add `multi-transclude` as a dependency
3. Use `ng-multi-transclude` in your templates

## Usage

Transclusion in AngularJS allows you to write a directive that is
parameterized by a block of HTML.  *Multi-transclusion* allows you to
write directives that are parameters by *multiple* blocks of HTML.

Consider an example: a fancy cancel button that has a
text-replaced icon and a title that should be styled specially.
In the former case, we might have a directive `ng-button` that populates
the following template:

    <button class="ng-button">
      <i class="cancel-icon"></i>
      <span ng-transclude class="title"></span>
    </button>

And use it thus:

    <div ng-button>
      Are you <b>sure</b> you want to delete the thing?
    </div>

Which would generate:

    <button class="ng-button">
      <i class="cancel-icon"></i>
      <span>
        Are you <b>sure</b> you want to delete the thing?
      </span>
    </button>

With multi-transclusion, you can write directives whose templates
have several "holes" that you can populate individually, by name.
Let's expand our example to a directive `ng-multi-button`, that
has both a title and a *hint*, both of which should be allowed
to be arbitrary templates:

    <button class="ng-multi-button">
      <div>
        <i class="cancel-icon"></i>
        <span ng-multi-transclude="title" class="title"></span>
      </div>
      <div>
        <i class="hint-icon">
        <span ng-multi-transclude="hint" class="hint"></span>
      </div>
    </button>

Now we can populate each block independently, reusing the structure
in the directive's template instead of forcing each use
of `ng-button` to include its own hint.

    <div ng-multi-button>
      <span name="title">
        Are you <b>sure</b> you want to delete the thing?
      </span>
      <span name="hint">
        When you delete the thing it's gone <i>forever</i>,
        so be extra careful!
      </span>
    </div>

To see something like this in action, check out this
[demo](http://plnkr.co/edit/kMH2lYJ20LqNjgqwJ6W6?p=preview).
