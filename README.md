# ng-multi-transclude

Richer transclusion for AngularJS; see <http://zachsnow.com/blog/2013/angularjs-multi-transclusion/>.

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


In the former case, we might have a directive `ng-button` that populates
the following template:

    <button>
      <i class="cancel-icon"></i>
      <span ng-transclude class="title"></span>
    <button>

And use it thus:

    <div ng-button>
      Are you <b>sure</b> you want to delete the thing?
    </div>

Which would generate:

    <button>
      <i class="cancel-icon"></i>
      <span>
        Are you <b>sure</b> you want to delete the thing?
      </span>
    <button>

With multi-transclusion, you can write directives whose templates
have several "holes" that you can populate individuall, by name.
Let's expand our example:

    <button>
      <i class="cancel-icon"></i>
      <span ng-multi-transclude="title" class="title"></span>
      <span ng-multi-transclude="hint" class="hint"></span>
    </button>

Now we can populate each block independently, reusing the structure
in the directive's template instead of forcing each use
of `ng-button` to include its own hint.

    <div ng-button>
      <span name="title">
        Are you <b>sure</b> you want to delete the thing?
      </span>
      <span name="hint">
        When you delete the thing it's gone <i>forever</i>,
        so be extra careful!
      </span>
    </div>
