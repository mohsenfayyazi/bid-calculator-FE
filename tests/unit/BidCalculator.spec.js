import { mount } from '@vue/test-utils';
import BidCalculator from '@/components/BidCalculator.vue';

describe('BidCalculator.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(BidCalculator);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the title correctly', () => {
    expect(wrapper.find('.bid-calculator__title').text()).toBe('Vehicle Bid Calculator');
  });



  it('displays basic fee when mock data is set', async () => {
    // Manually set mock fee data
    await wrapper.setData({
      basePrice: 500,
      vehicleType: 'Common',
      basicFee: 100,
      sellerFee: 50,
      associationFee: 25,
      storageFee: 100,
      totalCost: 275,
    });

    expect(wrapper.find('.bid-calculator__fee-list').text()).toContain('Basic Fee: $100.00');
    expect(wrapper.find('.bid-calculator__fee-list').text()).toContain('Total Cost: $275.00');
  });
});
