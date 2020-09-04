import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  Button,
  Card,
  Checkbox,
  ExtensionPoint,
  TextField,
  Text,
  Stack,
  render,
  useData,
  useContainer,
  useSessionToken,
} from '@shopify/argo-admin-react';

// 'Add' mode should allow a user to add the current product to an existing selling plan
// [Shopify admin renders this mode inside a modal container]
function Add() {
  // Information about the product and/or plan your extension is editing.
  // Your extension receives different data in each mode.
  const data = useData();

  // The UI your extension renders inside
  const {close, done, setPrimaryAction, setSecondaryAction} = useContainer();

  // Session token contains information about the current user. Use it to authenticate calls
  // from your extension to your app server.
  const {getSessionToken} = useSessionToken();

  const [selectedPlans, setSelectedPlans] = useState([]);
  const mockPlans = [
    {name: 'Subscription Plan A', id: 'a'},
    {name: 'Subscription Plan B', id: 'b'},
    {name: 'Subscription Plan C', id: 'c'},
  ];

  // Configure the extension container UI
  useEffect(() => {
    setPrimaryAction({
      content: 'Add to plan',
      onAction: async () => {
        // Get a fresh session token before every call to your app server.
        const token = await getSessionToken();

        // Here, send the form data to your app server to add the product to an existing plan.

        // Upon completion, call done() to trigger a reload of the resource page, and close() to
        // terminate the extension.
        done();
        close();
      },
    });

    setSecondaryAction({
      content: 'Cancel',
      onAction: () => close(),
    });
  }, [getSessionToken, close, done, setPrimaryAction, setSecondaryAction]);

  return (
    <>
      <Text>
        Add {`{Product id ${data.productId}}`} to an existing plan or existing
        plans
      </Text>

      <Stack>
        {mockPlans.map((plan) => (
          <Checkbox
            key={plan.id}
            label={plan.name}
            onChange={(checked) => {
              const plans = checked
                ? selectedPlans.concat(plan.id)
                : selectedPlans.filter((id) => id !== plan.id);
              setSelectedPlans(plans);
            }}
            checked={selectedPlans.includes(plan.id)}
          />
        ))}
      </Stack>
    </>
  );
}

// 'Create' mode should create a new selling plan, and add the current product to it
// [Shopify admin renders this mode inside an app overlay container]
function Create() {
  const data = useData();
  const {close, done} = useContainer();
  const {getSessionToken} = useSessionToken();

  // Mock plan settings
  const [planTitle, setPlanTitle] = useState('');
  const [percentageOff, setPercentageOff] = useState('');
  const [deliveryFrequency, setDeliveryFrequency] = useState('');

  const onPrimaryAction = useCallback(async () => {
    const token = await getSessionToken();

    // Here, send the form data to your app server to create the new plan.

    done();
    close();
  }, [getSessionToken, close, done]);

  const actions = useMemo(
    () => (
      <Stack distribution="fill">
        <Button title="Cancel" onClick={() => close()} />
        <Stack distribution="trailing">
          <Button title="Create plan" onClick={onPrimaryAction} primary />
        </Stack>
      </Stack>
    ),
    [onPrimaryAction, close]
  );

  return (
    <Stack distribution="center">
      <Stack vertical>
        <Text size="titleLarge">Create subscription plan</Text>

        <Card
          title={`Create subscription plan for Product id ${data.productId}`}
          sectioned
        >
          <TextField
            label="Plan title"
            value={planTitle}
            onAfterChange={setPlanTitle}
          />
        </Card>

        <Card title="Delivery and discount" sectioned>
          <Stack>
            <TextField
              type="number"
              label="Delivery frequency (in weeks)"
              value={deliveryFrequency}
              onAfterChange={setDeliveryFrequency}
            />
            <TextField
              type="number"
              label="Percentage off (%)"
              value={percentageOff}
              onAfterChange={setPercentageOff}
            />
          </Stack>
        </Card>

        {actions}
      </Stack>
    </Stack>
  );
}

// 'Remove' mode should remove the current product from a selling plan.
// This should not delete the selling plan.
// [Shopify admin renders this mode inside a modal container]
function Remove() {
  const data = useData();
  const {close, done, setPrimaryAction, setSecondaryAction} = useContainer();
  const {getSessionToken} = useSessionToken();

  useEffect(() => {
    setPrimaryAction({
      content: 'Remove from plan',
      onAction: async () => {
        const token = await getSessionToken();

        // Here, send the form data to your app server to remove the product from the plan.

        done();
        close();
      },
    });

    setSecondaryAction({
      content: 'Cancel',
      onAction: () => close(),
    });
  }, [getSessionToken, close, done, setPrimaryAction, setSecondaryAction]);

  return (
    <Text>
      Remove {`{Product id ${data.productId}}`} from{' '}
      {`{Plan group id ${data.sellingPlanGroupId}}`}
    </Text>
  );
}

// 'Edit' mode should modify an existing selling plan.
// Changes should affect other products that have this plan applied.
// [Shopify admin renders this mode inside an app overlay container]
function Edit() {
  const data = useData();
  const {close, done} = useContainer();
  const {getSessionToken} = useSessionToken();

  const [planTitle, setPlanTitle] = useState('Current plan');
  const [percentageOff, setPercentageOff] = useState('10');
  const [deliveryFrequency, setDeliveryFrequency] = useState('1');

  const onPrimaryAction = useCallback(async () => {
    const token = await getSessionToken();

    // Here, send the form data to your app server to modify the selling plan.

    done();
    close();
  }, [getSessionToken, done, close]);

  const actions = useMemo(
    () => (
      <Stack distribution="fill">
        <Button title="Cancel" onClick={() => close()} />
        <Stack distribution="trailing">
          <Button title="Edit plan" onClick={onPrimaryAction} primary />
        </Stack>
      </Stack>
    ),
    [onPrimaryAction, close]
  );

  return (
    <Stack distribution="center">
      <Stack vertical>
        <Text size="titleLarge">Edit subscription plan</Text>

        <Card
          title={`Edit subscription plan for Product id ${data.productId}`}
          sectioned
        >
          <TextField
            label="Plan title"
            value={planTitle}
            onAfterChange={setPlanTitle}
          />
        </Card>

        <Card title="Delivery and discount" sectioned>
          <Stack>
            <TextField
              type="number"
              label="Delivery frequency (in weeks)"
              value={deliveryFrequency}
              onAfterChange={setDeliveryFrequency}
            />
            <TextField
              type="number"
              label="Percentage off (%)"
              value={percentageOff}
              onAfterChange={setPercentageOff}
            />
          </Stack>
        </Card>

        {actions}
      </Stack>
    </Stack>
  );
}

// Your extension must render all four modes
render(ExtensionPoint.SubscriptionManagementAdd, () => <Add />);
render(ExtensionPoint.SubscriptionManagementCreate, () => <Create />);
render(ExtensionPoint.SubscriptionManagementRemove, () => <Remove />);
render(ExtensionPoint.SubscriptionManagementEdit, () => <Edit />);