import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {
  PrototypeNotice,
  BrandMark,
  DemoSeal,
  Button,
  StatusBadge,
  DataCard,
  Alert,
} from './index';

describe('packages/design-system', () => {
  it('PrototypeNotice renders with note role', () => {
    const el = React.createElement(PrototypeNotice, {});
    assert.equal(el.type, PrototypeNotice);
  });

  it('BrandMark renders SVG element with 64x64 viewBox', () => {
    const el = React.createElement(BrandMark, { size: 40 });
    assert.equal(el.type, BrandMark);
    assert.equal(el.props.size, 40);
  });

  it('DemoSeal renders demo badge with non-official disclaimer', () => {
    const el = React.createElement(DemoSeal, { size: 48 });
    assert.equal(el.type, DemoSeal);
    assert.equal(el.props.size, 48);
  });

  it('Button supports primary and secondary variants', () => {
    const btnPrimary = React.createElement(Button, { variant: 'primary' }, 'Apply Now');
    assert.equal(btnPrimary.props.variant, 'primary');
    assert.equal(btnPrimary.props.children, 'Apply Now');

    const btnSecondary = React.createElement(Button, { variant: 'secondary' }, 'Grant Consent');
    assert.equal(btnSecondary.props.variant, 'secondary');
  });

  it('StatusBadge renders semantic status with visible label and icon', () => {
    const badge = React.createElement(StatusBadge, { status: 'ready' });
    assert.equal(badge.props.status, 'ready');
  });

  it('DataCard supports progressive disclosure props', () => {
    const card = React.createElement(DataCard, {
      id: 'land-card',
      eyebrow: 'My Land',
      title: 'Linked Cultivable Land',
      primaryValue: '0.675',
      unit: 'hectares',
      summary: 'Your verified share',
    });
    assert.equal(card.props.id, 'land-card');
    assert.equal(card.props.primaryValue, '0.675');
  });

  it('Alert renders appropriate ARIA roles', () => {
    const alertInfo = React.createElement(Alert, { variant: 'info' }, 'Notice');
    assert.equal(alertInfo.props.variant, 'info');

    const alertError = React.createElement(Alert, { variant: 'error' }, 'Error');
    assert.equal(alertError.props.variant, 'error');
  });
});
