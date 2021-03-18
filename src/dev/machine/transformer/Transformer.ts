/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export class Transformer extends ElectricMachine {
		readonly tier: number

		constructor(tier: number, defaultDrop?: number) {
			super();
			this.tier = tier;
			this.defaultDrop = defaultDrop;
		}

		defaultValues = {
			energy: 0,
			increaseMode: false
		}

		getTier(): number {
			return this.tier;
		}

		getEnergyStorage(): number {
			return this.getMaxPacketSize();
		}

		energyTick(type: string, src: any): void {
			let maxVoltage = this.getMaxPacketSize();
			if (this.data.increaseMode) {
				if (this.data.energy >= maxVoltage) {
					this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
				}
			}
			else {
				if (this.data.energy >= maxVoltage/4) {
					let output = this.data.energy;
					this.data.energy += src.add(output, maxVoltage/4) - output;
				}
			}
		}

		onRedstoneUpdate(signal: number): void {
			let newMode = signal > 0;
			if (newMode != this.data.increaseMode) {
				this.data.increaseMode = newMode;
				this.rebuildGrid();
			}
		}

		isEnergySource(): boolean {
			return true;
		}

		canReceiveEnergy(side: number): boolean {
			if (side == this.getFacing()) {
				return !this.data.increaseMode;
			}
			return this.data.increaseMode;
		}

		canExtractEnergy(side: number): boolean {
			if (side == this.getFacing()) {
				return this.data.increaseMode;
			}
			return !this.data.increaseMode;
		}

		isWrenchable(): boolean {
			return true;
		}

		setFacing(side: number): boolean {
			if (super.setFacing(side)) {
				this.rebuildGrid();
				return true;
			}
			return false;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			super.onItemUse(coords, item, player);
			return true;
		}
	}
}